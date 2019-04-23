package com.nobul.listings;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Order;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.nobul.listings.Models.Listing;
import com.nobul.listings.Mapping.PropertyTypes;

@Controller
public class RoutesController {
	@Autowired
	private ListingRepository listingRepository;
	
	@PersistenceContext
	private EntityManager em;
		
    public static boolean isNullOrEmpty(String str) {
        if(str != null && !str.isEmpty()) {
            return false;
        }
        return true;
    }

    
    // There totally IS a better way to do this, will get on it soon.
    @CrossOrigin(origins = {
    		"http://localhost:8080",
    		"http://localhost:8081",
			"https://dev2.nobul.com",
			"https://nobul-web-testing.firebaseapp.com",
			"https://www.nobul.com",
			"https://nobul.com"
			})
	@GetMapping(path="/sort")
	public @ResponseBody List<Listing> sortListings(
			@RequestParam(required=true) Float latBottom,
			@RequestParam(required=true) Float latTop,
			@RequestParam(required=true) Float lngLeft,
			@RequestParam(required=true) Float lngRight,
			
			@RequestParam(defaultValue = "", required=false) String sortBy,
			@RequestParam(defaultValue = "", required=false) Float priceLow,
			@RequestParam(defaultValue = "", required=false) Float priceHigh,
			@RequestParam(defaultValue = "", required=false) String propertyTypes,
			@RequestParam(defaultValue = "", required=false) Integer minBedrooms,
			@RequestParam(defaultValue = "", required=false) Integer minBathrooms,
			@RequestParam(defaultValue = "", required=false) Integer minParking
		) {
	    CriteriaBuilder builder = em.getCriteriaBuilder();
		CriteriaQuery<Listing> criteria = builder.createQuery(Listing.class);
	    Root<Listing> listingRoot = criteria.from(Listing.class);
	    
	    // List for filter criteria
	    List<Predicate> andPredicates = new ArrayList<Predicate>();
		List<Predicate> orPredicates = new ArrayList<Predicate>();
	    
	    // Limit to current coordinates
	    andPredicates.add(builder.gt(listingRoot.get("lat"), latBottom));
	    andPredicates.add(builder.lt(listingRoot.get("lat"), latTop));
	    andPredicates.add(builder.gt(listingRoot.get("lon"), lngLeft));
	    andPredicates.add(builder.lt(listingRoot.get("lon"), lngRight));
		
	    // Test for inputs and add filter queries
	    if(isNullOrEmpty(propertyTypes) != true) {
	    	String[] propertyTypesList = propertyTypes.split(",");
	    	
	    	// Loop property types and get correct map
	    	// "OR" all of these as we want all matching ones.
	    	for(String propertyType: propertyTypesList) {	    		
	    		if(Objects.equals(propertyType, new String("Condo/Apartment"))) {
	    	    	for(String condoString: PropertyTypes.CONDO) {
	    	    		orPredicates.add(builder.and(builder.equal(builder.lower(listingRoot.get("propertyTypeRaw")), condoString)));
	    	    	}
	    		} else if(Objects.equals(propertyType, new String("House/Townhouse"))) {
	    	    	for(String houseString: PropertyTypes.HOUSE) {
	    	    		orPredicates.add(builder.and(builder.equal(builder.lower(listingRoot.get("propertyTypeRaw")), houseString)));
	    	    	}
	    		}
	    	}
	    }
	    
	    if(priceLow != null) {
	    	andPredicates.add(builder.gt(listingRoot.get("listPrice"), priceLow));
	    }
	    
	    if(priceHigh != null) {
		    Float priceNoLimit = (float) 5000001;
		    Boolean unlimitedPrice = Float.compare(priceHigh, priceNoLimit) == 0;
		    
		    if(!unlimitedPrice) {
		    	andPredicates.add(builder.lt(listingRoot.get("listPrice"), priceHigh));
		    }
	    }
	    
	    if(minBedrooms != null) {
	    	andPredicates.add(builder.gt(listingRoot.get("bedroomCountTotal"), minBedrooms));
	    }
	    
	    if(minBathrooms != null) {
	    	andPredicates.add(builder.gt(listingRoot.get("bathroomCountTotal"), minBathrooms));
	    }
	    
	    if(minParking != null) {
	    	andPredicates.add(builder.gt(listingRoot.get("numParkingSpaces"), minParking));
	    }

	    
	    // Construct WHERE clause	    
	    if (andPredicates.size() > 0 && orPredicates.size() == 0) {
	        // no need to make new predicate, it is already a conjunction
	    	criteria.where(andPredicates.toArray(new Predicate[andPredicates.size()]));
	    } else if (andPredicates.size() == 0 && orPredicates.size() > 0) {
	        // make a disjunction, this part is missing above
	        Predicate p = builder.disjunction();
	        p = builder.or(orPredicates.toArray(new Predicate[orPredicates.size()]));
	        criteria.where(p);
	    } else {
	        // both types of statements combined
	        Predicate o = builder.and(andPredicates.toArray(new Predicate[andPredicates.size()]));
	        Predicate p = builder.or(orPredicates.toArray(new Predicate[orPredicates.size()]));
	        criteria.where(o, p);
	    }


	    
	    
	    // Set sort order
	    if(isNullOrEmpty(sortBy) != true) {
	    	Integer ascendingIndex = sortBy.indexOf("LowHigh");
	    	Integer descendingIndex = sortBy.indexOf("HighLow");
	    	boolean ascending = ascendingIndex != -1;
	    	String orderByColumn = sortBy.substring(0, ascending ? ascendingIndex : descendingIndex);

		    // Set ORDER BY
			Order order = ascending ?
					builder.asc(listingRoot.get(orderByColumn))
		        :	builder.desc(listingRoot.get(orderByColumn));
		    criteria.orderBy(order);
	    }
	    
	    // Return only listingId
	    criteria.select(listingRoot.get("sourceListingIdRaw"));
	    
	    return em.createQuery(criteria).getResultList();
	}


    @CrossOrigin(origins = {
    		"http://localhost:8080",
    		"http://localhost:8081",
			"https://dev2.nobul.com",
			"https://nobul-web-testing.firebaseapp.com",
			"https://www.nobul.com",
			"https://nobul.com"
			})
    @GetMapping(path="/details")
	public @ResponseBody Listing getlisting(@RequestParam String listingId) {
		return listingRepository.findByListingId(listingId);
	}
}
