import houseCottage from "@/assets/estate/house-cottage.png";
import houseFamily from "@/assets/estate/house-villa.png";
import houseVilla from "@/assets/estate/house-penthouse.png";
import houseMansion from "@/assets/estate/house-mansion.png";
import carBudget from "@/assets/estate/car-compact.png";
import carSports from "@/assets/estate/car-sports.png";
import carSuper from "@/assets/estate/car-super.png";
import carSuv from "@/assets/estate/car-suv.png";
import houseCastle from "@/assets/estate/house-castle.png";
import houseShack from "@/assets/estate/house-shack.png";
import houseSkyscraper from "@/assets/estate/house-skyscraper.png";
import houseWhiteHouse from "@/assets/estate/house-whitehouse.png";
import housePalace from "@/assets/estate/house-palace.png";
import carSkoda from "@/assets/estate/car-skoda.png";
import carPorsche from "@/assets/estate/car-porsche.png";
import carSuzuki from "@/assets/estate/car-suzuki.png";
import carBmw from "@/assets/estate/car-bmw.png";
import carMercedes from "@/assets/estate/car-mercedes.png";
import carMustang from "@/assets/estate/car-mustang.png";
import carGolfCart from "@/assets/estate/car-golfcart.png";
import carSkateboard from "@/assets/estate/car-skateboard.png";
import carBicycle from "@/assets/estate/car-bicycle.png";
import carFlyingCarpet from "@/assets/estate/car-flyingcarpet.png";
import carMaserati from "@/assets/estate/car-maserati.png";
import carToyota from "@/assets/estate/car-toyota.png";

export const ESTATE_IMAGES: Record<string, string> = {
  // Existing houses (matched to DB IDs)
  house_cottage: houseCottage,
  house_family: houseFamily,
  house_villa: houseVilla,
  house_mansion: houseMansion,
  // New houses
  house_castle: houseCastle,
  house_shack: houseShack,
  house_skyscraper: houseSkyscraper,
  house_whitehouse: houseWhiteHouse,
  house_palace: housePalace,
  // Existing cars (matched to DB IDs)
  car_budget: carBudget,
  car_sports: carSports,
  car_super: carSuper,
  car_suv: carSuv,
  // New cars
  car_skoda: carSkoda,
  car_porsche: carPorsche,
  car_suzuki: carSuzuki,
  car_bmw: carBmw,
  car_mercedes: carMercedes,
  car_mustang: carMustang,
  car_golfcart: carGolfCart,
  car_skateboard: carSkateboard,
  car_bicycle: carBicycle,
  car_flyingcarpet: carFlyingCarpet,
  car_maserati: carMaserati,
  car_toyota: carToyota,
};
