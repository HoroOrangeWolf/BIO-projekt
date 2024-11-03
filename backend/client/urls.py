from django.urls import path, include

from .views import VisitsView, SpecializationView, DoctorView, DoctorVisits

urlpatterns = [
    path('visits/', VisitsView.as_view(), name='visits'),
    path('doctor/<int:pk>', DoctorView.as_view(), name='doctor'),
    path('doctor/<int:pk>/visits', DoctorVisits.as_view(), name='doctor'),
    path('specialization/', SpecializationView.as_view(), name='specialization'),
    path('specialization/<int:pk>', SpecializationView.as_view(), name='specialization')
]
