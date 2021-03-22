import * as R from "ramda";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { getMongoRepository } from "typeorm";
import { Context } from "types";
import Rating from "../entities/Rating";

@InputType()
class RatingInput {
  @Field()
  postId: string;

  @Field()
  value: number;
}

@ObjectType()
class PostRating {
  @Field()
  postId: string;

  @Field()
  fullRating: number;

  @Field(() => Number, { nullable: true })
  userRating?: number;
}

@Resolver(Rating)
class RatingResolver {
  @Query(() => [PostRating])
  async postRating(
    @Ctx("getUserId") getUserId: Context["getUserId"]
  ): Promise<PostRating[]> {
    type FullRating = { postId: string; fullRating: number };

    const ratingRepository = getMongoRepository(Rating);
    const fullRatingsEntity = ratingRepository.aggregate<FullRating>([
      {
        $group: {
          _id: "$postId",
          fullRating: { $sum: "$value" },
        },
      },
      {
        $project: {
          _id: 0,
          postId: "$_id",
          fullRating: 1,
        },
      },
    ]);

    const userId = await getUserId();

    const [fullRatings, userRatings] = await Promise.all([
      fullRatingsEntity.toArray(),
      userId ? Rating.find({ where: { userId } }) : [],
    ]);

    return fullRatings.map((fullRating) => {
      const userRatingEntry = userRatings.find(
        R.propEq("postId", fullRating.postId)
      );

      return {
        ...fullRating,
        userRating: userRatingEntry?.value,
      };
    });
  }

  @Mutation(() => Rating)
  async updateRating(
    @Arg("data") data: RatingInput,
    @Ctx("getUserId") getUserId: Context["getUserId"],
    @Ctx("getQuotes") getQuotes: Context["getQuotes"]
  ): Promise<Rating> {
    const { postId, value } = data;

    if (![-1, 0, 1].includes(value)) {
      throw Error("rating value must be one of [-1, 0, 1]");
    }

    const quotes = await getQuotes();

    if (!quotes.some(R.propEq("id", postId))) {
      throw Error("no post with such id");
    }

    const userId = await getUserId();

    if (!userId) {
      throw Error("Not authenticated");
    }

    let rating = await Rating.findOne({ where: { postId, userId } });

    if (!rating) {
      rating = Rating.create({ userId, postId, value });

      // TODO: fix error
      const CREATE_VALUE_MAP_ERROR =
        "Cannot read property 'createValueMap' of undefined";
      try {
        await rating.save();
      } catch (e) {
        if (!e.message.includes(CREATE_VALUE_MAP_ERROR)) {
          console.error(e);
        }
      }
    } else {
      rating.value = value;

      await Rating.update(rating._id, { value });
    }

    return rating;
  }

  // @Mutation(() => Boolean)
  // @UseMiddleware(isAuth)
  // async deleteAllRatings(): Promise<Boolean> {
  //   await Rating.clear();

  //   return true;
  // }
}

export default RatingResolver;
