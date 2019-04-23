package com.nobul.listings.Models;

import java.sql.Timestamp;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/*
 * Model to represent all listing data used on front-end
 */
@Entity
@Table(name="listing_active", schema="nobul")
public class Listing {
	
	//
	//  Listing ID
	//  ============================================
	@Id
	protected String listingId;
	
	public String getListingId() {
		return listingId;
	}
	
	public void setListingId(String listingId) {
		this.listingId = listingId;
	}
	
	//
	//  Feed ID
	//  ============================================
	protected String sourceListingIdRaw;
	
	public String getSourceListingIdRaw() {
		return sourceListingIdRaw;
	}
	
	public void setSourceListingIdRaw(String sourceListingIdRaw) {
		this.sourceListingIdRaw = sourceListingIdRaw;
	}
	
	// *********************************************
	//
	// Fields for sort and search
	//
	// *********************************************

	//
	//  Listing Price
	//  ============================================
	protected Float listPrice;
	
	public Float getListingPrice() {
		return listPrice;
	}
	
	public void setListingPrice(Float listPrice) {
		this.listPrice = listPrice;
	}

	//
	//  Longitude
	//  ============================================
	protected Float lon;
	
	public Float getLon() {
		return lon;
	}
	
	public void setLon(Float lon) {
		this.lon = lon;
	}

	//
	//  Latitude
	//  ============================================
	protected Float lat;
	
	public Float getLat() {
		return lat;
	}
	
	public void setLat(Float lat) {
		this.lat = lat;
	}

	//
	//  Bedrooms
	//  ============================================
	protected Integer bedroomCountTotal;
	
	public Integer getBedroomCountTotal() {
		return bedroomCountTotal;
	}
	
	public void setBedroomCountTotal(Integer bedroomCountTotal) {
		this.bedroomCountTotal = bedroomCountTotal;
	}

	//
	//  Bathrooms
	//  ============================================
	protected Integer bathroomCountTotal;
	
	public Integer getBathroomCountTotal() {
		return bathroomCountTotal;
	}
	
	public void setBathroomCountTotal(Integer bathroomCountTotal) {
		this.bathroomCountTotal = bathroomCountTotal;
	}

	//
	//  Parking spaces
	//  ============================================
	protected Integer numParkingSpaces;
	
	public Integer getNumParkingSpaces() {
		return numParkingSpaces;
	}
	
	public void setNumParkingSpaces(Integer numParkingSpaces) {
		this.numParkingSpaces = numParkingSpaces;
	}

	//
	//  Property type raw
	//  ============================================
	protected String propertyTypeRaw;
	
	public String getPropertyTypeRaw() {
		return propertyTypeRaw;
	}
	
	public void setPropertyTypeRaw(String propertyTypeRaw) {
		this.propertyTypeRaw = propertyTypeRaw;
	}

	//
	//  Lot size
	//  ============================================
	protected Float lotSizeRaw;
	
	public Float getLotSizeRaw() {
		return lotSizeRaw;
	}
	
	public void setLotSizeRaw(Float lotSizeRaw) {
		this.lotSizeRaw = lotSizeRaw;
	}

	//
	//  Lot frontage
	//  ============================================
	protected Float lotFrontage;
	
	public Float getLotFrontage() {
		return lotFrontage;
	}
	
	public void setLotFrontage(Float lotFrontage) {
		this.lotFrontage = lotFrontage;
	}

	//
	//  List time
	//  ============================================
	protected Timestamp listTime;
	
	public Timestamp getListTime() {
		return listTime;
	}
	
	public void setListTime(Timestamp listTime) {
		this.listTime = listTime;
	}
	

	
	// *********************************************
	//
	// Fields for property details
	//
	// *********************************************

	//
	//  MLS Number
	//  ============================================
	protected String mlsNumber;
	
	public String getMlsNumber() {
		return mlsNumber;
	}
	
	public void setMlsNumber(String mlsNumber) {
		this.mlsNumber = mlsNumber;
	}
	
	//
	//  Street Number
	//  ============================================
	protected String addressRaw;
	
	public String getAddressRaw() {
		return addressRaw;
	}
	
	public void setAddressRaw(String addressRaw) {
		this.addressRaw = addressRaw;
	}
	
	//
	//  Remarks
	//  ============================================
	protected String remarks;
	
	public String getRemarks() {
		return remarks;
	}
	
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
	
}

