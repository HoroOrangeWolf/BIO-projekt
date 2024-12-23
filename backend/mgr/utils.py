from rest_framework import permissions
from rest_framework.pagination import PageNumberPagination


class CustomPagination(PageNumberPagination):
    page_size = 1000
    page_size_query_param = "page_size"
    max_page_size = 1000


class IsUserWithSpecialPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True

        permission_action = ''

        if request.method == 'GET':
            permission_action = 'view'
        elif request.method == 'POST':
            permission_action = 'add'
        elif request.method in ['PUT', 'PATCH']:
            permission_action = 'change'
        elif request.method == 'DELETE':
            permission_action = 'delete'

        if not permission_action:
            return False

        model_name = getattr(view, 'model_name', None)
        if not model_name:
            return False

        app_label = getattr(view, 'app_label', '')
        permission = f"{app_label}.{permission_action}_{model_name}"

        return request.user.has_perm(permission)