import { registerEnumType } from "@nestjs/graphql";

// ===== CONDITION =====
export enum PropertyCondition {
  NEW = "NEW",
  USED = "USED",
}
registerEnumType(PropertyCondition, { name: "PropertyCondition" });

// ===== TYPE =====
export enum PropertyType {
  SEDAN = "SEDAN",
  SUV = "SUV",
  COUPE = "COUPE",
  HATCHBACK = "HATCHBACK",
  CONVERTIBLE = "CONVERTIBLE",
  VAN = "VAN",
  TRUCK = "TRUCK",
  ELECTRIC = "ELECTRIC",
  WAGON = "WAGON",           
  PICKUP = "PICKUP",         
  MINIVAN = "MINIVAN",       
  CROSSOVER = "CROSSOVER",   
}
registerEnumType(PropertyType, { name: "PropertyType" });

// ===== STATUS =====
export enum PropertyStatus {
  ACTIVE = "ACTIVE",           // Faol, ko'rinadi
  SOLD = "SOLD",               // Sotilgan
  RENTED = "RENTED",           // Hozir rent qilingan
  RESERVED = "RESERVED",       // Band qilingan (to'lov kutilmoqda)
  MAINTENANCE = "MAINTENANCE", // Ta'mirlashda
  INACTIVE = "INACTIVE",       // Vaqtincha faol emas (agent tomonidan)
  DELETE = "DELETE",           // O'chirilgan
}
registerEnumType(PropertyStatus, { name: "PropertyStatus" });

export enum PropertyBrand {
  KIA = "KIA",
  HYUNDAI = "HYUNDAI",
  TOYOTA = "TOYOTA",
  HONDA = "HONDA",
  BMW = "BMW",
  MERCEDES = "MERCEDES",
  AUDI = "AUDI",
  VOLKSWAGEN = "VOLKSWAGEN",
  FORD = "FORD",
  CHEVROLET = "CHEVROLET",
  NISSAN = "NISSAN",
  TESLA = "TESLA",
  LEXUS = "LEXUS",
  PORSCHE = "PORSCHE",
  LAND_ROVER = "LAND_ROVER",
  VOLVO = "VOLVO",
  JEEP = "JEEP",
  MASERATI = "MASERATI",
  FERRARI = "FERRARI",
  LAMBORGHINI = "LAMBORGHINI",
  BENTLEY = "BENTLEY",
  ROLLS_ROYCE = "ROLLS_ROYCE",
}
registerEnumType(PropertyBrand, { name: "PropertyBrand" });


// ===== FUEL TYPE =====
export enum PropertyFuelType {
  GASOLINE = "GASOLINE",       // Benzin
  DIESEL = "DIESEL",           // Dizel
  HYBRID = "HYBRID",           // Gibrid
  ELECTRIC = "ELECTRIC",       // Elektr
  PLUGIN_HYBRID = "PLUGIN_HYBRID", // Plugin Hybrid
  CNG = "CNG",                 // Compressed Natural Gas
  LPG = "LPG",                 // Liquefied Petroleum Gas
}
registerEnumType(PropertyFuelType, { name: "PropertyFuelType" });

// ===== COLOR =====
export enum PropertyColor {
  BLACK = "BLACK",
  WHITE = "WHITE",
  GRAY = "GRAY",
  SILVER = "SILVER",     
  RED = "RED",
  BLUE = "BLUE",
  YELLOW = "YELLOW",
  ORANGE = "ORANGE",
  GREEN = "GREEN",       
  BROWN = "BROWN",       
  GOLD = "GOLD",         
  PURPLE = "PURPLE",     
  BEIGE = "BEIGE",       
}
registerEnumType(PropertyColor, { name: "PropertyColor" });

// ===== LOCATION =====
export enum PropertyLocation {
  MADRID = "MADRID",
  BARCELONA = "BARCELONA",
  VALENCIA = "VALENCIA",
  SEVILLA = "SEVILLA",
  MALAGA = "MALAGA",
  BILBAO = "BILBAO",
  ZARAGOZA = "ZARAGOZA",
  MURCIA = "MURCIA",
  ALICANTE = "ALICANTE",     
  GRANADA = "GRANADA",       
  CORDOBA = "CORDOBA",       
  PALMA = "PALMA",           
}
registerEnumType(PropertyLocation, { name: "PropertyLocation" });

// ===== TRANSMISSION =====
export enum PropertyTransmission {
  AUTOMATIC = "AUTOMATIC",
  MANUAL = "MANUAL",
  SEMI_AUTOMATIC = "SEMI_AUTOMATIC", // Semi-automatic/CVT
}
registerEnumType(PropertyTransmission, { name: "PropertyTransmission" });

// ===== FEATURES =====
export enum PropertyFeatures {
  // Safety
  ABS = "ABS",                                    
  AIRBAGS = "AIRBAGS",                           
  PARKING_SENSORS = "PARKING_SENSORS",           
  BACKUP_CAMERA = "BACKUP_CAMERA",              
  BLIND_SPOT_MONITOR = "BLIND_SPOT_MONITOR",     
  LANE_ASSIST = "LANE_ASSIST",                   
  
  // Comfort
  ADAPTIVE_CRUISE_CONTROL = "ADAPTIVE_CRUISE_CONTROL",
  CRUISE_CONTROL = "CRUISE_CONTROL",            
  HEATED_SEATS = "HEATED_SEATS",
  COOLED_SEATS = "COOLED_SEATS",
  LEATHER_SEATS = "LEATHER_SEATS",               
  POWER_SEATS = "POWER_SEATS",                  
  MEMORY_SEATS = "MEMORY_SEATS",                 
  SUNROOF = "SUNROOF",                           
  PANORAMIC_ROOF = "PANORAMIC_ROOF",             
  
  // Technology
  NAVIGATION_SYSTEM = "NAVIGATION_SYSTEM",
  BLUETOOTH = "BLUETOOTH",                      
  APPLE_CARPLAY = "APPLE_CARPLAY",              
  ANDROID_AUTO = "ANDROID_AUTO",                 
  WIRELESS_CHARGING = "WIRELESS_CHARGING",       
  USB_PORTS = "USB_PORTS",                      
  WIFI_HOTSPOT = "WIFI_HOTSPOT",                
  
  // Convenience
  KEYLESS_START = "KEYLESS_START",
  KEYLESS_ENTRY = "KEYLESS_ENTRY",               
  REMOTE_START = "REMOTE_START",
  POWER_LIFTGATE = "POWER_LIFTGATE",            
  RAIN_SENSING_WIPERS = "RAIN_SENSING_WIPERS",   
  AUTO_HEADLIGHTS = "AUTO_HEADLIGHTS",          
  
  // Climate
  CLIMATE_CONTROL = "CLIMATE_CONTROL",           
  DUAL_ZONE_CLIMATE = "DUAL_ZONE_CLIMATE",       
  TRI_ZONE_CLIMATE = "TRI_ZONE_CLIMATE",         
  HEATED_STEERING_WHEEL = "HEATED_STEERING_WHEEL", 
  
  // Audio
  PREMIUM_AUDIO = "PREMIUM_AUDIO",               
  SUBWOOFER = "SUBWOOFER",                       
  
  // Performance
  SPORT_MODE = "SPORT_MODE",                     
  AWD = "AWD",                                   
  FOUR_WHEEL_DRIVE = "FOUR_WHEEL_DRIVE",         
  TURBO = "TURBO",                               
}
registerEnumType(PropertyFeatures, { name: "PropertyFeatures" });

export enum PropertyCylinders {
  THREE = "THREE",
  FOUR = "FOUR",
  FIVE = "FIVE",
  SIX = "SIX",
  EIGHT = "EIGHT",
  TEN = "TEN",
  TWELVE = "TWELVE",
}

registerEnumType(PropertyCylinders, {
	name: 'PropertyCylinders',
});