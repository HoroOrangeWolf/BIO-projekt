from datetime import timedelta

from django.db.models import Q
from rest_framework import serializers

from administration.serializers import SimpleUserSerializer
from .models import Visit, DoctorSpecialization, DoctorDetails, MedicalDocumentation


class AddVisitsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Visit
        fields = ('id', 'visit_name', 'start_time',
                  'description', 'doctor', 'user')

    def validate_start_time(self, value):
        start_time = value
        end_time = start_time + timedelta(minutes=30)

        visit_id = self.instance.id if self.instance else None

        overlapping_visits = Visit.objects.filter(
            Q(start_time__lt=end_time) & Q(start_time__gte=start_time) & Q(is_visit_finished=False),
            doctor=self.initial_data['doctor']
        )

        if visit_id:
            overlapping_visits = overlapping_visits.exclude(id=visit_id)

        if overlapping_visits.exists():
            raise serializers.ValidationError("There is an existing visit overlapping with the selected start time.")

        return value


class SpecializationSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorSpecialization
        fields = ('id', 'specialization_name')


class DoctorDetailsSerializerGet(serializers.ModelSerializer):
    doctor_specializations = SpecializationSerializer(many=True, read_only=True)

    class Meta:
        model = DoctorDetails
        fields = ('id', 'doctor_number', 'doctor_specializations')


class VisitsSerializer(serializers.ModelSerializer):
    doctor = DoctorDetailsSerializerGet(read_only=True)

    class Meta:
        model = Visit
        fields = (
            'id',
            'visit_name',
            'is_visit_finished',
            'description',
            'created_at',
            'doctor',
            'start_time'
        )


class VisitsNonSensitiveData(serializers.ModelSerializer):
    class Meta:
        model = Visit
        # Id jest wymagane
        fields = ('id', 'start_time')


class DoctorDetailsSerializerPost(serializers.ModelSerializer):
    class Meta:
        model = DoctorDetails
        fields = ('id', 'doctor_number', 'user', 'doctor_specializations')


class DoctorFullModelGet(serializers.ModelSerializer):
    user = SimpleUserSerializer(read_only=True)
    doctor_specializations = SpecializationSerializer(read_only=True, many=True)

    class Meta:
        model = DoctorDetails
        fields = ('id', 'user', 'doctor_number', 'doctor_specializations')


class VisitsForUserSerializer(serializers.ModelSerializer):
    doctor = DoctorFullModelGet(read_only=True)

    class Meta:
        model = Visit
        fields = ("id", "visit_name", "is_visit_finished", "description", "start_time", "created_at", "doctor")


class VisitsForDoctorSerializer(serializers.ModelSerializer):
    user = SimpleUserSerializer(read_only=True)

    class Meta:
        model = Visit
        fields = [
            "id", "visit_name", "is_visit_finished", "description", "start_time", "created_at", "user",
        ]


class VisitReadDocumentationSerializer(serializers.ModelSerializer):
    visit = VisitsSerializer(read_only=True)

    class Meta:
        model = MedicalDocumentation
        fields = (
            "id",
            "file_name",
            "file_description",
            "visit"
        )
