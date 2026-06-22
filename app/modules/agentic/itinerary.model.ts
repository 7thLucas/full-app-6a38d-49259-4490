import {
  prop,
  getModelForClass,
  modelOptions,
} from "@typegoose/typegoose";

export class ItineraryActivity {
  @prop({ type: String, required: true })
  time!: string;

  @prop({ type: String, required: true })
  title!: string;

  @prop({ type: String, required: false })
  description?: string;

  @prop({ type: String, required: false })
  location?: string;

  @prop({ type: Number, required: false })
  lat?: number;

  @prop({ type: Number, required: false })
  lng?: number;

  @prop({ type: String, required: false })
  category?: string; // "food" | "attraction" | "hotel" | "transport"

  @prop({ type: String, required: false })
  priceRange?: string;

  @prop({ type: Number, required: false })
  rating?: number;
}

export class ItineraryDay {
  @prop({ type: Number, required: true })
  day!: number;

  @prop({ type: String, required: true })
  date!: string;

  @prop({ type: String, required: false })
  title?: string;

  @prop({ type: () => [ItineraryActivity], default: [] })
  activities!: ItineraryActivity[];
}

export class ItineraryHotel {
  @prop({ type: String, required: true })
  name!: string;

  @prop({ type: String, required: false })
  description?: string;

  @prop({ type: String, required: false })
  priceRange?: string;

  @prop({ type: Number, required: false })
  rating?: number;

  @prop({ type: String, required: false })
  location?: string;

  @prop({ type: Number, required: false })
  lat?: number;

  @prop({ type: Number, required: false })
  lng?: number;
}

@modelOptions({
  schemaOptions: {
    collection: "tbl_itineraries",
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
})
export class Itinerary {
  @prop({ type: String, required: true })
  userId!: string;

  @prop({ type: String, required: true })
  title!: string;

  @prop({ type: String, required: true })
  destination!: string;

  @prop({ type: String, required: false })
  startDate?: string;

  @prop({ type: String, required: false })
  endDate?: string;

  @prop({ type: String, required: false, enum: ["low", "mid", "high"] })
  budget?: string;

  @prop({ type: () => [String], default: [] })
  interests!: string[];

  @prop({ type: () => [ItineraryDay], default: [] })
  days!: ItineraryDay[];

  @prop({ type: () => [ItineraryHotel], default: [] })
  hotels!: ItineraryHotel[];

  @prop({ type: String, required: false })
  summary?: string;

  @prop({ type: String, required: false })
  rawAiResponse?: string;

  @prop({ type: Boolean, default: false })
  isPublic!: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ItineraryModel = getModelForClass(Itinerary);
