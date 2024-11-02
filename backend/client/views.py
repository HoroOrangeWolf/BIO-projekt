from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Visit
from .serializers import VisitsSerializer


class VisitsView(APIView):
    def post(self, request):
        user_id = request.user.id
        copy_request = request.data.copy()
        copy_request['user'] = user_id
        visit_instance = VisitsSerializer(data=copy_request)

        if visit_instance.is_valid():
            visit_instance.save()
            return Response("Saved visit", status=200)
        else:
            return Response(visit_instance.errors, status=400)

    def get(self, request):
        user_visits = Visit.objects.filter(user=request.user.id, is_visit_finished=False).order_by('-start_time')
        return Response(VisitsSerializer(user_visits, many=True).data)
