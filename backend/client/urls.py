from django.urls import path, include

from .views import VisitsView, SpecializationView

urlpatterns = [
    path('visits/', VisitsView.as_view(), name='visits'),
    path('specialization/', SpecializationView.as_view(), name='specialization'),
    path('specialization/<int:pk>', SpecializationView.as_view(), name='specialization')
]
