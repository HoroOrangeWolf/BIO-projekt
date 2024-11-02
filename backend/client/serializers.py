from rest_framework import serializers

from .models import Visit


class VisitsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Visit
        fields = ('id', 'visit_name', 'start_time', 'expected_end_time', 'is_approved_by_doctor', 'is_visit_finished',
                  'description', 'created_at')
