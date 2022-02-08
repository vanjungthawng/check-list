// import user model
const { User } = require("../models");
const { signToken } = require("../utils/auth");

module.exports = {
  // get all users
  async getAllUsers(req, res) {
    const users = await User.find();
    return res.json(users);
  },
  // get a single user by id or name
  async getSingleUser({ user = null, params }, res) {
    const foundUser = await User.findOne({
      $or: [
        { _id: user ? user._id : params.id },
        { username: params.username },
      ],
    });

    if (!foundUser) {
      return res
        .status(400)
        .json({ message: "Cannot find a user with this id!" });
    }

    res.json(foundUser);
  },
  // create a user, sign a token, and send it back
  async createUser({ body }, res) {
    const user = await User.create(body);

    if (!user) {
      return res.status(400).json({ message: "Something is wrong!" });
    }
    const token = signToken(user);
    res.json({ token, user });
  },

  async login({ body }, res) {
    const user = await User.findOne({
      $or: [{ username: body.username }, { email: body.email }],
    });
    if (!user) {
      return res.status(400).json({ message: "Can't find this user" });
    }

    const correctPw = await user.isCorrectPassword(body.password);

    if (!correctPw) {
      return res.status(400).json({ message: "Wrong password!" });
    }
    const token = signToken(user);
    res.json({ token, user });
  },

  async saveShow({ user, body }, res) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $addToSet: { savedShows: body } },
        { new: true, runValidators: true }
      );
      return res.json(updatedUser);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  },
  //get a show
  async getShow({ user, params }, res) {
    //   console.log(user);
    //   console.log(params);
    try {
      const showRes = await User.findOne(
        { _id: user._id, "savedShows.tvMazeId": params.id },
        "savedShows.$"
      );
      return res.json(showRes);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  },

  //update a show
  async updateShow({ user, body, params }, res) {
    //   console.log(user);
    try {
      const updatedShow = await User.findOneAndUpdate(
        { _id: user._id, "savedShows.tvMazeId": params.id },
        { "savedShows.$": body },
        { new: true, runValidators: true }
      );
      return res.json(updatedShow);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  },

  // remove a show from `savedShows`
  async deleteShow({ user, params }, res) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $pull: { savedShows: { tvMazeId: params.id } } },
        { new: true }
      );
      if (!updatedUser) {
        return res
          .status(404)
          .json({ message: "Couldn't find user with this id!" });
      }
      return res.json(updatedUser);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  },
};
