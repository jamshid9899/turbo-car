import { registerEnumType } from '@nestjs/graphql';

// ===== CONDITION =====
export enum PropertyCondition {
	NEW = 'NEW',
	USED = 'USED',
}
registerEnumType(PropertyCondition, { name: 'PropertyCondition' });

// ===== TYPE =====
export enum PropertyType {
	SEDAN = 'SEDAN',
	SUV = 'SUV',
	COUPE = 'COUPE',
	HATCHBACK = 'HATCHBACK',
	CONVERTIBLE = 'CONVERTIBLE',
	VAN = 'VAN',
	TRUCK = 'TRUCK',
	ELECTRIC = 'ELECTRIC',
	WAGON = 'WAGON',
	PICKUP = 'PICKUP',
	MINIVAN = 'MINIVAN',
	CROSSOVER = 'CROSSOVER',
}
registerEnumType(PropertyType, { name: 'PropertyType' });

// ===== STATUS =====
export enum PropertyStatus {
	ACTIVE = 'ACTIVE', // Faol, ko'rinadi
	SOLD = 'SOLD', // Sotilgan
	RENTED = 'RENTED', // Hozir rent qilingan
	RESERVED = 'RESERVED', // Band qilingan (to'lov kutilmoqda)
	MAINTENANCE = 'MAINTENANCE', // Ta'mirlashda
	INACTIVE = 'INACTIVE', // Vaqtincha faol emas (agent tomonidan)
	DELETE = 'DELETE', // O'chirilgan
}
registerEnumType(PropertyStatus, { name: 'PropertyStatus' });

export enum PropertyBrand {
	TOYOTA = 'TOYOTA',
	BMW = 'BMW',
	MERCEDES = 'MERCEDES',
	AUDI = 'AUDI',
	HONDA = 'HONDA',
	FORD = 'FORD',
	CHEVROLET = 'CHEVROLET',
	NISSAN = 'NISSAN',
	HYUNDAI = 'HYUNDAI',
	KIA = 'KIA',
	VOLKSWAGEN = 'VOLKSWAGEN',
	TESLA = 'TESLA',
	LEXUS = 'LEXUS',
	MAZDA = 'MAZDA',
	SUBARU = 'SUBARU',
	JEEP = 'JEEP',
	RAM = 'RAM',
	GMC = 'GMC',
	PORSCHE = 'PORSCHE',
	LAND_ROVER = 'LAND_ROVER',
	VOLVO = 'VOLVO',
	INFINITI = 'INFINITI',
	ACURA = 'ACURA',
	CADILLAC = 'CADILLAC',
	BUICK = 'BUICK',
	CHRYSLER = 'CHRYSLER',
	DODGE = 'DODGE',
	MITSUBISHI = 'MITSUBISHI',
	GENESIS = 'GENESIS',
	ALFA_ROMEO = 'ALFA_ROMEO',
	MINI = 'MINI',
	JAGUAR = 'JAGUAR',
	MASERATI = 'MASERATI',
	BENTLEY = 'BENTLEY',
	ROLLS_ROYCE = 'ROLLS_ROYCE',
	FERRARI = 'FERRARI',
	LAMBORGHINI = 'LAMBORGHINI',
	ASTON_MARTIN = 'ASTON_MARTIN',
	MCLAREN = 'MCLAREN',
	BUGATTI = 'BUGATTI',
	OTHER = 'OTHER',
}
registerEnumType(PropertyBrand, { name: 'PropertyBrand' });

// ===== FUEL TYPE =====
export enum PropertyFuelType {
	GASOLINE = 'GASOLINE',
	DIESEL = 'DIESEL',
	ELECTRIC = 'ELECTRIC',
	HYBRID = 'HYBRID',
	PLUG_IN_HYBRID = 'PLUG_IN_HYBRID',
	HYDROGEN = 'HYDROGEN',
	ETHANOL = 'ETHANOL',
	BIODIESEL = 'BIODIESEL',
	COMPRESSED_NATURAL_GAS = 'COMPRESSED_NATURAL_GAS',
	LIQUEFIED_PETROLEUM_GAS = 'LIQUEFIED_PETROLEUM_GAS',
}
registerEnumType(PropertyFuelType, { name: 'PropertyFuelType' });

// ===== COLOR =====
export enum PropertyColor {
	WHITE = 'WHITE',
	BLACK = 'BLACK',
	SILVER = 'SILVER',
	GRAY = 'GRAY',
	RED = 'RED',
	BLUE = 'BLUE',
	GREEN = 'GREEN',
	YELLOW = 'YELLOW',
	ORANGE = 'ORANGE',
	BROWN = 'BROWN',
	GOLD = 'GOLD',
	BEIGE = 'BEIGE',
	PURPLE = 'PURPLE',
	PINK = 'PINK',
	BRONZE = 'BRONZE',
	CHARCOAL = 'CHARCOAL',
	CREAM = 'CREAM',
	BURGUNDY = 'BURGUNDY',
	NAVY = 'NAVY',
	TAN = 'TAN',
	OTHER = 'OTHER',
}
registerEnumType(PropertyColor, { name: 'PropertyColor' });

// ===== LOCATION =====
export enum PropertyLocation {
	MADRID = 'MADRID',
	BARCELONA = 'BARCELONA',
	VALENCIA = 'VALENCIA',
	SEVILLA = 'SEVILLA',
	MALAGA = 'MALAGA',
	BILBAO = 'BILBAO',
	ZARAGOZA = 'ZARAGOZA',
	MURCIA = 'MURCIA',
	ALICANTE = 'ALICANTE',
	GRANADA = 'GRANADA',
	CORDOBA = 'CORDOBA',
	PALMA = 'PALMA',
}
registerEnumType(PropertyLocation, { name: 'PropertyLocation' });

// ===== TRANSMISSION =====
export enum PropertyTransmission {
	AUTOMATIC = 'AUTOMATIC',
	MANUAL = 'MANUAL',
	CVT = 'CVT',
	SEMI_AUTOMATIC = 'SEMI_AUTOMATIC',
	DUAL_CLUTCH = 'DUAL_CLUTCH',
}
registerEnumType(PropertyTransmission, { name: 'PropertyTransmission' });

// ===== FEATURES =====
export enum PropertyFeatures {
	AIR_CONDITIONING = 'AIR_CONDITIONING',
	CLIMATE_CONTROL = 'CLIMATE_CONTROL',
	HEATED_SEATS = 'HEATED_SEATS',
	VENTILATED_SEATS = 'VENTILATED_SEATS',
	LEATHER_SEATS = 'LEATHER_SEATS',
	POWER_SEATS = 'POWER_SEATS',
	MEMORY_SEATS = 'MEMORY_SEATS',
	SUNROOF = 'SUNROOF',
	PANORAMIC_ROOF = 'PANORAMIC_ROOF',
	NAVIGATION = 'NAVIGATION',
	BLUETOOTH = 'BLUETOOTH',
	APPLE_CARPLAY = 'APPLE_CARPLAY',
	ANDROID_AUTO = 'ANDROID_AUTO',
	BACKUP_CAMERA = 'BACKUP_CAMERA',
	PARKING_SENSORS = 'PARKING_SENSORS',
	BLIND_SPOT_MONITOR = 'BLIND_SPOT_MONITOR',
	LANE_DEPARTURE_WARNING = 'LANE_DEPARTURE_WARNING',
	ADAPTIVE_CRUISE_CONTROL = 'ADAPTIVE_CRUISE_CONTROL',
	KEYLESS_ENTRY = 'KEYLESS_ENTRY',
	PUSH_BUTTON_START = 'PUSH_BUTTON_START',
	REMOTE_START = 'REMOTE_START',
	ALLOY_WHEELS = 'ALLOY_WHEELS',
	FOG_LIGHTS = 'FOG_LIGHTS',
	LED_HEADLIGHTS = 'LED_HEADLIGHTS',
	PREMIUM_AUDIO = 'PREMIUM_AUDIO',
	WIRELESS_CHARGING = 'WIRELESS_CHARGING',
	USB_PORTS = 'USB_PORTS',
	ROOF_RACK = 'ROOF_RACK',
	TOWING_PACKAGE = 'TOWING_PACKAGE',
	ALL_WHEEL_DRIVE = 'ALL_WHEEL_DRIVE',
	FOUR_WHEEL_DRIVE = 'FOUR_WHEEL_DRIVE',
}
registerEnumType(PropertyFeatures, { name: 'PropertyFeatures' });

export enum PropertyCylinders {
	THREE = 'THREE',
	FOUR = 'FOUR',
	FIVE = 'FIVE',
	SIX = 'SIX',
	EIGHT = 'EIGHT',
	TEN = 'TEN',
	TWELVE = 'TWELVE',
	SIXTEEN = 'SIXTEEN',
}

registerEnumType(PropertyCylinders, {
	name: 'PropertyCylinders',
});
