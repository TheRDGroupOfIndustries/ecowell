import { connectToMongoDB } from "../../../utils/db";
import User from "../../../models/User";

export default async function handler(req, res) {
  const { query, method, body } = req;

  if (method !== "POST") {
    return res.status(405).json({ error: `Method ${method} not allowed` });
  }

  const {
    first_name,
    last_name,
    email,
    password,
    phone_number,
    address,
    flat_plot,
    country,
    region_state,
    city,
    zip_code,
  } = body;

  await connectToMongoDB();

  let existingUser;

  if (email) {
    existingUser = await User.findOne({ email });
  } else if (phone_number) {
    existingUser = await User.findOne({ phone_number });
  } else {
    return res.status(400).json({ error: "Invalid user credentials!" });
  }
  if (!existingUser) {
    return res.status(404).json({ error: "User not found!" });
  }

  //console.log(existingUser);

  const updatedFields = {};

  if (first_name && existingUser.first_name !== first_name) {
    updatedFields.first_name = first_name;
  }
  if (last_name && existingUser.last_name !== last_name) {
    updatedFields.last_name = last_name;
  }
  if (phone_number && existingUser.phone_number !== phone_number) {
    updatedFields.phone_number = phone_number;
  }
  if (email && existingUser.email !== email) {
    updatedFields.email = email;
  }
  if (address && existingUser.address !== address) {
    updatedFields.address = address;
  }
  if (flat_plot && existingUser.flat_plot !== flat_plot) {
    updatedFields.flat_plot = flat_plot;
  }
  if (country && existingUser.country !== country) {
    updatedFields.country = country;
  }
  if (region_state && existingUser.region_state !== region_state) {
    updatedFields.region_state = region_state;
  }
  if (city && existingUser.city !== city) {
    updatedFields.city = city;
  }
  if (zip_code && existingUser.zip_code !== zip_code) {
    updatedFields.zip_code = zip_code;
  }

  try {
    if (Object.keys(updatedFields).length > 0) {
      await User.updateOne({ _id: existingUser._id }, { $set: updatedFields });

      return res.status(200).json({
        message: `User updated successfully! Updated fields: ${Object.keys(
          updatedFields
        ).join(", ")}`,
      });
    } else {
      return res
        .status(200)
        .json({ message: "No fields were changed, but update was attempted." });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error: " + error });
  }
}
