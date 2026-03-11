from rest_framework import serializers
from .models import Listing, LikedListing, SavedListing
from apps.accounts.serializers import UserSerializer


class ListingSerializer(serializers.ModelSerializer):
    user      = UserSerializer(read_only=True)
    image_url = serializers.SerializerMethodField()
    is_liked  = serializers.SerializerMethodField()

    def get_image_url(self, obj):
        if not obj.image:
            return None
        return obj.image.url

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        return LikedListing.objects.filter(user=request.user, listing=obj).exists()

    class Meta:
        model  = Listing
        fields = (
            'id', 'user', 'title', 'location', 'image', 'image_url',
            'description', 'price', 'likes_count', 'is_liked', 'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'user', 'likes_count', 'is_liked', 'created_at', 'updated_at', 'image_url')
