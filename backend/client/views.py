import mimetypes
import os

from django.http import Http404, FileResponse, HttpResponse
from django.utils.encoding import smart_str
from rest_framework import viewsets
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from administration.serializers import UserSerializer, SimpleUserSerializer
from auth_api.models import AuthUser
from mgr.encryption import EncryptionService
from mgr.utils import IsUserWithSpecialPermission
from .models import Visit, DoctorSpecialization, DoctorDetails, MedicalDocumentation
from .serializers import SpecializationSerializer, VisitsNonSensitiveData, AddVisitsSerializer, VisitsSerializer, \
    VisitsForDoctorSerializer, VisitsForUserSerializer, VisitReadDocumentationSerializer, \
    VisitWriteDocumentationSerializer, MedicalDocumentationUpdateSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.generics import get_object_or_404


class VisitsView(APIView):
    app_label = "client"
    permission_classes = [IsUserWithSpecialPermission]

    def get(self, request):
        user_visits = Visit.objects.filter(user=request.user.id, is_visit_finished=False).order_by('-start_time')

        serialized = VisitsSerializer(user_visits, many=True)

        return Response(serialized.data)


class PatientView(APIView):
    app_label = "client"
    model_name = "user"

    def get(self, request):
        users = AuthUser.objects.filter(doctor_details=None)

        serialized = SimpleUserSerializer(users, many=True)

        return Response(serialized.data, status=200)


class DoctorCurrentVisit(APIView):
    permission_classes = [IsUserWithSpecialPermission]
    required_permissions = {
        'POST': 'client.can_add_visit',
        'PUT': 'client.can_edit_visit',
        'GET': 'client.can_get_visit',
    }

    def post(self, request):
        # TODO: Dodać walidacje czy czasy się pokrywają
        copied = request.data.copy()
        doctor_details = DoctorDetails.objects.filter(user__id=request.user.id).first()
        copied['user'] = copied['patient']
        copied['doctor'] = doctor_details.id

        visit_serialized = AddVisitsSerializer(data=copied)

        if visit_serialized.is_valid():
            visit_serialized.save()
            return Response('Ok', status=201)
        else:
            return Response(visit_serialized.errors, status=400)

    def put(self, request, pk, patient_id):
        visit = get_object_or_404(Visit, pk=pk)

        copied = request.data.copy()
        doctor_details = DoctorDetails.objects.filter(user__id=request.user.id).first()
        copied['doctor'] = doctor_details.id

        patient_details = AuthUser.objects.filter(id=patient_id).first()
        copied['user'] = patient_details.id

        visit_serialized = AddVisitsSerializer(instance=visit, data=copied, partial=True)

        if visit_serialized.is_valid():
            visit_serialized.save()
            return Response(visit_serialized.data, status=200)
        else:
            return Response(visit_serialized.errors, status=400)

    def get(self, request):
        doctor_visits = Visit.objects.filter(doctor__user__id=request.user.id).order_by('start_time')
        serialized_visits = VisitsSerializer(doctor_visits, many=True)
        return Response(serialized_visits.data, status=200)


class DoctorVisits(APIView):
    app_label = "client"
    model_name = "visit"
    permission_classes = [IsUserWithSpecialPermission]
    required_permissions = {
        'GET': 'client.can_get_visit',
        'POST': 'client.can_add_visit',
        'PUT': 'client.can_edit_visit',
        'PATCH': 'client.can_edit_visit',
        'DELETE': 'client.can_delete_visit',
    }

    def post(self, request, pk):
        # TODO: Dodać walidacje czy czasy się pokrywają
        copied = request.data.copy()
        doctor_details = DoctorDetails.objects.filter(user__id=copied['doctor']).first()
        copied['user'] = request.user.id
        copied['doctor'] = doctor_details.id

        visit_serialized = AddVisitsSerializer(data=copied)

        if visit_serialized.is_valid():
            visit_serialized.save()
            return Response('Ok', status=201)
        else:
            return Response(visit_serialized.errors, status=400)

    def put(self, request, doctor_id, pk):
        visit = get_object_or_404(Visit, pk=pk)

        copied = request.data.copy()

        doctor_details = DoctorDetails.objects.filter(id=doctor_id).first()

        copied['doctor'] = doctor_details.id
        copied['user'] = request.user.id

        visit_serialized = AddVisitsSerializer(instance=visit, data=copied, partial=True)

        if visit_serialized.is_valid():
            visit_serialized.save()
            return Response(visit_serialized.data, status=200)
        else:
            return Response(visit_serialized.errors, status=400)

    def get(self, request, pk):
        doctor_visits = Visit.objects.filter(doctor__user__id=pk)
        serialized_visits = VisitsNonSensitiveData(doctor_visits, many=True)
        return Response(serialized_visits.data, status=200)


class MedicalDocumentationByDoctorView(APIView):
    app_label = "client"
    permission_classes = [IsUserWithSpecialPermission]
    required_permissions = {
        'GET': 'client.can_get_medical_documentation',
    }

    def get(self, request):
        doctor_id = request.user.id
        docs = MedicalDocumentation.objects.filter(visit__doctor__user_id=doctor_id)
        serializer = VisitReadDocumentationSerializer(docs, many=True)
        return Response(serializer.data)


class DoctorView(APIView):
    app_label = "client"

    def get(self, request, pk):
        doctors = DoctorDetails.objects.filter(doctor_specializations__id=pk)

        users = []

        for x in doctors:
            users.append(x.user)

        serialized = UserSerializer(users, many=True)

        return Response(serialized.data, status=200)


class SpecializationView(APIView):
    app_label = "client"
    permission_classes = [IsUserWithSpecialPermission]
    required_permissions = {
        'GET': "client.can_get_specialization",
    }

    def get(self, request):
        specializations = DoctorSpecialization.objects.all()
        serialized = SpecializationSerializer(specializations, many=True)
        return Response(serialized.data)

    def put(self, request, pk):
        specialization = DoctorSpecialization.objects.get(id=pk)

        serialized = SpecializationSerializer(specialization, data=request.data)

        if serialized.is_valid():
            serialized.save()
            return Response("Saved data", status=200)
        else:
            return Response(serialized.errors, status=400)

    def delete(self, request, pk):
        try:
            specialization = DoctorSpecialization.objects.get(id=pk)
        except DoctorSpecialization.DoesNotExist:
            raise NotFound("Not found")

        specialization.delete()

        return Response("Removed", status=200)

    def post(self, request):
        instance = SpecializationSerializer(data=request.data)

        if instance.is_valid():
            instance.save()
            return Response('Saved specialization', status=200)
        else:
            return Response(instance.errors, status=400)


class VisitsForUser(APIView):
    app_label = "client"
    permission_classes = [IsUserWithSpecialPermission]
    required_permissions = {
        'DELETE': 'client.can_delete_visit',
        'GET': 'client.can_get_visit',
    }

    def delete(self, request, pk):
        visit = Visit.objects.get(id=pk)

        if visit is None:
            return Response("Not found", status=400)

        user_id = request.user.id

        if not visit.user.id == user_id:
            return Response("Nie masz dostępu do tej wizyty", status=403)

        if visit.is_visit_finished:
            return Response("Nie można usunąć zakończonej wizyty", status=400)

        visit.delete()

        return Response("Usunięto", status=200)

    def get(self, request):
        param = request.GET.get('isVisitFinished', 'False')

        param_lowercase = param.lower()

        is_visit_finished = param_lowercase == 'true'

        visits = Visit.objects.filter(user__id=request.user.id, is_visit_finished=is_visit_finished).order_by(
            'start_time')
        serialized = VisitsForUserSerializer(visits, many=True)
        return Response(serialized.data, status=200)


class VisitDocumentation(APIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsUserWithSpecialPermission]
    app_label = "client"
    required_permissions = {
        "GET": 'client.can_get_medical_documentation',
        "PATCH": 'client.can_edit_medical_documentation',
        "PUT": 'client.can_edit_medical_documentation',
        "DELETE": 'client.can_delete_medical_documentation',
        "POST": 'client.can_add_medical_documentation',
    }

    def get(self, request):
        user_id = request.user.id

        documentation = MedicalDocumentation.objects.filter(visit__user__id=user_id)

        serialized = VisitReadDocumentationSerializer(documentation, many=True)

        return Response(serialized.data, status=200)

    def patch(self, request, pk, doc_id):
        user_id = request.user.id
        documentation = get_object_or_404(
            MedicalDocumentation,
            id=doc_id,
            visit__id=pk,
            visit__user__id=user_id
        )

        serializer = MedicalDocumentationUpdateSerializer(
            documentation,
            data=request.data,
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        else:
            return Response(serializer.errors, status=400)

    def post(self, request, pk):
        visit = get_object_or_404(Visit, pk=pk)

        serializer = VisitWriteDocumentationSerializer(data=request.data, context={'visit': visit})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        else:
            return Response(serializer.errors, status=400)


class DownloadDocumentation(APIView):
    app_label = "client"

    def get(self, request, pk, doc_id):
        user_id = request.user.id
        try:
            documentation = MedicalDocumentation.objects.get(
                id=doc_id,
                visit__id=pk
            )
            if not documentation.file:
                return Response("File not found", status=404)

            file_path = documentation.file.path

            with open(file_path, 'rb') as f:
                encrypted_content = f.read()
                encryption_service = EncryptionService()
                decrypted_content = encryption_service.decrypt(encrypted_content)

            original_file_name = os.path.basename(documentation.file.name)

            if documentation.file_name:
                name, ext = os.path.splitext(documentation.file_name)
                if not ext:
                    _, original_ext = os.path.splitext(original_file_name)
                    file_name = documentation.file_name + original_ext
                else:
                    file_name = documentation.file_name
            else:
                file_name = original_file_name

            mime_type, _ = mimetypes.guess_type(file_path)
            if mime_type is None:
                mime_type = 'application/octet-stream'

            response = HttpResponse(decrypted_content, content_type=mime_type)
            response['Content-Disposition'] = f'attachment; filename="{smart_str(file_name)}"'
            return response

        except MedicalDocumentation.DoesNotExist:
            return Response("File not found", status=404)


class VisitsForDoctor(viewsets.ModelViewSet):
    app_label = "client"
    model_name = "visit"
    queryset = Visit.objects.all()
    serializer_class = VisitsForDoctorSerializer
    permission_classes = [IsUserWithSpecialPermission]
    required_permissions = {
        'GET': 'client.can_get_visit',
        'PATCH': 'client.can_edit_visit',
    }

    def list(self, request, *args, **kwargs):
        doctor_id = request.query_params.get('doctor')

        if doctor_id:
            visits = Visit.objects.filter(doctor__id=doctor_id)
        else:
            visits = []

        serializer = self.get_serializer(visits, many=True)
        return Response(serializer.data, status=200)
