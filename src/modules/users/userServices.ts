import { NewUser } from "../../typings/types";
import SchoolModel from "../schools/schoolModel";
import UserModel from "./userModel";

// CRUD services
// @desc insert a user in the database
// @params user
const insertUser = (user: NewUser) => {
  return UserModel.create(user);
};

// @desc find all users by school id
// @params filters, fieldsToReturn
const findFilterAllUsers = (
  filters: { school_id: string },
  fieldsToReturn: string
) => {
  return UserModel.find(filters).select(fieldsToReturn).lean().exec();
};

// @desc find a user by school id and email or school id and user id
// @params filters, fieldsToReturn
const findUserByProperty = (
  filters:
    | { school_id: string; email: string }
    | { school_id: string; _id: string },
  fieldsToReturn: string
) => {
  return UserModel.findOne(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
};

// @desc update a user by school id and other property
// @params filters, user
const modifyFilterUser = (
  filters: {
    school_id: string;
    _id: string;
  },
  user: NewUser
) => {
  return UserModel.findOneAndUpdate(filters, user, {
    new: true,
    runValidators: true,
  });
};

// @desc delete a user by school id and other property
// @params filters
const removeFilterUser = (filters: { school_id: string; _id: string }) => {
  return UserModel.findOneAndDelete(filters).lean().exec();
};

/* Services from other entities */
// @desc find a school by id
// @params schoolId, fieldsToReturn
const findSchoolById = (schoolId: string, fieldsToReturn: string) => {
  return SchoolModel.findById(schoolId).select(fieldsToReturn).lean().exec();
};

export {
  insertUser,
  findFilterAllUsers,
  findUserByProperty,
  modifyFilterUser,
  removeFilterUser,
  /* Services from other entities */
  findSchoolById,
};
