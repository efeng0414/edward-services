package com.nobul.listings;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nobul.listings.Models.Listing;

// This will be AUTO IMPLEMENTED by Spring into a Bean called userRepository
// CRUD refers Create, Read, Update, Delete

public interface ListingRepository extends JpaRepository<Listing, Integer> {
    public Listing findByListingId(String listingId);
}
