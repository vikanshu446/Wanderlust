const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js")

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default: "https://media.istockphoto.com/id/588953882/photo/beautiful-curb-appeal-of-two-story-house-with-large-trees.jpg?s=1024x1024&w=is&k=20&c=-iye3nyigx_c_onMCeNCxg7j2qHZx-Q9CK88-L-zn2k=",
    set: (v) =>
      v === ""
        ? "https://media.istockphoto.com/id/588953882/photo/beautiful-curb-appeal-of-two-story-house-with-large-trees.jpg?s=1024x1024&w=is&k=20&c=-iye3nyigx_c_onMCeNCxg7j2qHZx-Q9CK88-L-zn2k="
        : v,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

});
//mongoose middleeware
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } })
  };
})
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;