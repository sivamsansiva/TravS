from django.db import models
from django.conf import settings


class Listing(models.Model):
    user        = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='listings',
    )
    title       = models.CharField(max_length=200)
    location    = models.CharField(max_length=200)
    image_url   = models.URLField(max_length=500)
    description = models.TextField()
    price       = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    likes_count = models.PositiveIntegerField(default=0)
    created_at  = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class SavedListing(models.Model):
    user       = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='saved_listings')
    listing    = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='saved_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'listing')

    def __str__(self):
        return f"{self.user} saved {self.listing}"
