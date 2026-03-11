from rest_framework import serializers
from .models import Listing
from apps.accounts.serializers import UserSerializer


class ListingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model  = Listing
        fields = (
            'id', 'user', 'title', 'location', 'image_url',
            'description', 'price', 'likes_count', 'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'user', 'likes_count', 'created_at', 'updated_at')
