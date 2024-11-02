from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import VisitsView

# router = DefaultRouter()
#
# router.register(prefix=r'visits',viewset=VisitsView, basename='')

urlpatterns = [
    path('visits/', VisitsView.as_view(), name='visits')
]
