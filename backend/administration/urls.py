from django.urls import path

from administration.views import UserView, GroupView, PermissionView

urlpatterns = [
    path('user/', UserView.as_view(), name='user'),
    path('user/<int:pk>/', UserView.as_view(), name='user'),
    path('group/', GroupView.as_view(), name='group'),
    path('group/<int:pk>/', GroupView.as_view(), name='group'),
    path('permission/', PermissionView.as_view(), name='permission'),
]
