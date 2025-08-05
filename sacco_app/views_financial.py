from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from .models import Member, SavingsAccount, Loan, Transaction
from .serializers import MemberSerializer, SavingsAccountSerializer, LoanSerializer, TransactionSerializer
from .views import IsAdminUser, IsFinanceOfficer


class MemberViewSet(viewsets.ModelViewSet):
    """Member management views"""
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'membership_date']
    search_fields = ['member_id', 'user__first_name', 'user__last_name', 'user__email']
    ordering_fields = ['created_at', 'membership_date']
    
    @action(detail=True, methods=['get'])
    def accounts(self, request, pk=None):
        """Get member's savings accounts"""
        member = self.get_object()
        accounts = SavingsAccount.objects.filter(member=member)
        serializer = SavingsAccountSerializer(accounts, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def loans(self, request, pk=None):
        """Get member's loans"""
        member = self.get_object()
        loans = Loan.objects.filter(member=member)
        serializer = LoanSerializer(loans, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def transactions(self, request, pk=None):
        """Get member's transactions"""
        member = self.get_object()
        transactions = Transaction.objects.filter(member=member).order_by('-created_at')[:50]
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)


class SavingsAccountViewSet(viewsets.ModelViewSet):
    """Savings account management views"""
    queryset = SavingsAccount.objects.all()
    serializer_class = SavingsAccountSerializer
    permission_classes = [IsFinanceOfficer]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['account_type', 'is_active']
    search_fields = ['account_number', 'member__user__first_name', 'member__user__last_name']
    ordering_fields = ['created_at', 'balance']
    
    @action(detail=True, methods=['post'])
    def deposit(self, request, pk=None):
        """Make a deposit to savings account"""
        account = self.get_object()
        amount = request.data.get('amount')
        
        if not amount or float(amount) <= 0:
            return Response({'error': 'Invalid amount'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update account balance
        account.balance += float(amount)
        account.save()
        
        # Create transaction record
        transaction = Transaction.objects.create(
            member=account.member,
            transaction_id=f"TXN{str(timezone.now().timestamp()).replace('.', '')}",
            transaction_type='deposit',
            amount=amount,
            description=f'Deposit to {account.account_number}',
            savings_account=account,
            balance_after=account.balance
        )
        
        return Response({
            'message': 'Deposit successful',
            'new_balance': account.balance,
            'transaction': TransactionSerializer(transaction).data
        })
    
    @action(detail=True, methods=['post'])
    def withdraw(self, request, pk=None):
        """Make a withdrawal from savings account"""
        account = self.get_object()
        amount = request.data.get('amount')
        
        if not amount or float(amount) <= 0:
            return Response({'error': 'Invalid amount'}, status=status.HTTP_400_BAD_REQUEST)
        
        if account.balance < float(amount):
            return Response({'error': 'Insufficient funds'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update account balance
        account.balance -= float(amount)
        account.save()
        
        # Create transaction record
        transaction = Transaction.objects.create(
            member=account.member,
            transaction_id=f"TXN{str(timezone.now().timestamp()).replace('.', '')}",
            transaction_type='withdrawal',
            amount=amount,
            description=f'Withdrawal from {account.account_number}',
            savings_account=account,
            balance_after=account.balance
        )
        
        return Response({
            'message': 'Withdrawal successful',
            'new_balance': account.balance,
            'transaction': TransactionSerializer(transaction).data
        })


class LoanViewSet(viewsets.ModelViewSet):
    """Loan management views"""
    queryset = Loan.objects.all()
    serializer_class = LoanSerializer
    permission_classes = [IsFinanceOfficer]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['loan_type', 'status']
    search_fields = ['loan_number', 'member__user__first_name', 'member__user__last_name']
    ordering_fields = ['created_at', 'amount', 'due_date']
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve a loan application"""
        loan = self.get_object()
        if loan.status != 'pending':
            return Response({'error': 'Loan is not pending'}, status=status.HTTP_400_BAD_REQUEST)
        
        loan.status = 'approved'
        loan.approval_date = timezone.now().date()
        loan.save()
        
        return Response({'message': 'Loan approved successfully'})
    
    @action(detail=True, methods=['post'])
    def disburse(self, request, pk=None):
        """Disburse an approved loan"""
        loan = self.get_object()
        if loan.status != 'approved':
            return Response({'error': 'Loan is not approved'}, status=status.HTTP_400_BAD_REQUEST)
        
        loan.status = 'active'
        loan.disbursement_date = timezone.now().date()
        loan.save()
        
        # Create transaction record
        transaction = Transaction.objects.create(
            member=loan.member,
            transaction_id=f"TXN{str(timezone.now().timestamp()).replace('.', '')}",
            transaction_type='loan_disbursement',
            amount=loan.amount,
            description=f'Loan disbursement for {loan.loan_number}',
            loan=loan,
            balance_after=0  # This would be the loan balance
        )
        
        return Response({'message': 'Loan disbursed successfully'})
    
    @action(detail=True, methods=['post'])
    def make_payment(self, request, pk=None):
        """Make a loan payment"""
        loan = self.get_object()
        amount = request.data.get('amount')
        
        if not amount or float(amount) <= 0:
            return Response({'error': 'Invalid amount'}, status=status.HTTP_400_BAD_REQUEST)
        
        if loan.remaining_balance < float(amount):
            return Response({'error': 'Payment amount exceeds remaining balance'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update loan balance
        loan.remaining_balance -= float(amount)
        if loan.remaining_balance <= 0:
            loan.status = 'completed'
        loan.save()
        
        # Create transaction record
        transaction = Transaction.objects.create(
            member=loan.member,
            transaction_id=f"TXN{str(timezone.now().timestamp()).replace('.', '')}",
            transaction_type='loan_payment',
            amount=amount,
            description=f'Loan payment for {loan.loan_number}',
            loan=loan,
            balance_after=loan.remaining_balance
        )
        
        return Response({
            'message': 'Payment successful',
            'remaining_balance': loan.remaining_balance,
            'transaction': TransactionSerializer(transaction).data
        })


class TransactionViewSet(viewsets.ReadOnlyModelViewSet):
    """Transaction views (read-only)"""
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsFinanceOfficer]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['transaction_type', 'member']
    search_fields = ['transaction_id', 'member__user__first_name', 'member__user__last_name']
    ordering_fields = ['created_at', 'amount'] 