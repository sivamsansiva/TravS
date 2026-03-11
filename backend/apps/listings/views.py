from django.db import transaction
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Listing, SavedListing
from .serializers import ListingSerializer
from .permissions import IsOwnerOrReadOnly
from .filters import ListingFilter


class ListingViewSet(viewsets.ModelViewSet):
    queryset           = Listing.objects.select_related('user').all()
    serializer_class   = ListingSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    filterset_class    = ListingFilter

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    # POST /api/listings/{id}/like/
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def like(self, request, pk=None):
        with transaction.atomic():
            listing = self.get_object()
            listing.likes_count += 1
            listing.save(update_fields=['likes_count'])
        return Response({'likes_count': listing.likes_count})

    # POST /api/listings/{id}/save/  — toggles save/unsave
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def save(self, request, pk=None):
        listing = self.get_object()
        obj, created = SavedListing.objects.get_or_create(user=request.user, listing=listing)
        if not created:
            obj.delete()
            return Response({'saved': False}, status=status.HTTP_200_OK)
        return Response({'saved': True}, status=status.HTTP_201_CREATED)

    # GET /api/listings/saved/
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def saved(self, request):
        saved_ids = SavedListing.objects.filter(user=request.user).values_list('listing_id', flat=True)
        qs = Listing.objects.select_related('user').filter(id__in=saved_ids)
        return Response(self.get_serializer(qs, many=True).data)
