import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    role: {
      type: String,
      required: true,
      default: "user",
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    password: {
      type: String,
      required: false,
    },
    phone_number: {
      type: String,
      maxLength: 10,
      required: false,
    },
    first_name: {
      type: String,
      trim: true,
      required: false,
    },
    last_name: {
      type: String,
      trim: true,
      required: false,
    },
    profile_image: {
      type: String,
      required: true,
      default: "/assets/images/user.png",
    },
    date_of_birth: {
      type: Date,
      required: false,
    },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
      required: false,
    },
    wishlist_products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Products",
        required: false,
      },
    ],
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);

export default User;
