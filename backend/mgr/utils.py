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

        required_map = getattr(view, 'required_permissions', {})

        required_perm = required_map.get(request.method, None)
        if not required_perm:
            return False

        return request.user.has_perm(required_perm)