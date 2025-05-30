from rest_framework import viewsets
from .models import Income, Expense
from .serializers import IncomeSerializer, ExpenseSerializer
from rest_framework.permissions import IsAuthenticated

class IncomeViewSet(viewsets.ModelViewSet):
    queryset = Income.objects.all().order_by('-date_received')
    serializer_class = IncomeSerializer
    permission_classes = [IsAuthenticated]

class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all().order_by('-date_spent')
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]
