import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../../errors/bad-request";
import ConflictError from "../../errors/conflict";
import NotFoundError from "../../errors/not-found";

import {
  insertUser,
  findFilterAllUsers,
  findUserByProperty,
  modifyFilterUser,
  removeFilterUser,
  /* Services from other entities */
  findSchoolById,
} from "./userServices";

/* models */
const userModel = "user";

// @desc create a user
// @route POST /api/v1/users
// @access Private
// @fields: body: {firstName:[string], lastName:[string], school_id:[string], email:[string], password:[string], role:[string], status:[string], hasTeachingFunc:[boolean]}
const createUser = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const {
    school_id,
    firstName,
    lastName,
    email,
    password,
    role,
    status,
    hasTeachingFunc,
  } = body;
  /* check if the school exists */
  const schoolSearchCriteria = school_id;
  const schoolFieldsToReturn = "-createdAt -updatedAt";
  const existingSchool = await findSchoolById(
    schoolSearchCriteria,
    schoolFieldsToReturn
  );
  if (!existingSchool) {
    throw new ConflictError("Please create the school first");
  }
  /* check if the email is already in use */
  const searchCriteria = { school_id, email };
  const fieldsToReturn = "-password -createdAt -updatedAt";
  const duplicateUserEmailFound = await findUserByProperty(
    searchCriteria,
    fieldsToReturn
  );
  if (duplicateUserEmailFound) {
    throw new ConflictError("Please try a different email address");
  }
  /* create the user */
  const newUser = {
    school_id: school_id,
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
    role: role,
    status: status,
    hasTeachingFunc: hasTeachingFunc,
  };
  const userCreated = await insertUser(newUser);
  if (!userCreated) {
    throw new BadRequestError("User not created");
  }
  res.status(StatusCodes.CREATED).json({ msg: "User created successfully!" });
};

// @desc get all the users
// @route GET /api/v1/users
// @access Private
// @fields: body: {school_id:[string]}
const getUsers = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const { school_id } = body;
  /* filter by school id */
  const filters = { school_id: school_id };
  const fieldsToReturn = "-password -createdAt -updatedAt";
  const usersFound = await findFilterAllUsers(filters, fieldsToReturn);
  /* get all fields */
  if (usersFound?.length === 0) {
    throw new NotFoundError("No users found");
  }
  res.status(StatusCodes.OK).json(usersFound);
};

// @desc get the user by id
// @route GET /api/v1/users/:id
// @access Private
// @fields: params: {id:[string]},  body: {school_id:[string]}
const getUser = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields */
  const { id: _id } = params;
  const { school_id } = body;
  /* get the user */
  const searchCriteria = { school_id, _id };
  const fieldsToReturn = "-password -createdAt -updatedAt";
  const userFound = await findUserByProperty(searchCriteria, fieldsToReturn);
  if (!userFound) {
    throw new NotFoundError("User not found");
  }
  res.status(StatusCodes.OK).json(userFound);
};

// @desc update a user
// @route PUT /api/v1/users/:id
// @access Private
// @fields: params: {id:[string]},  body: {firstName:[string], lastName:[string], school_id:[string], email:[string], password:[string], password:[string], role:[string], status:[string], hasTeachingFunc:[boolean]}
const updateUser = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields */
  const { id: userId } = params;
  const {
    school_id,
    firstName,
    lastName,
    email,
    password,
    role,
    status,
    hasTeachingFunc,
  } = body;
  /* check if the user email is already in use by another user */
  const searchCriteria = { school_id, email };
  const fieldsToReturn = "-password -createdAt -updatedAt";
  const duplicateEmail = await findUserByProperty(
    searchCriteria,
    fieldsToReturn
  );
  if (duplicateEmail && duplicateEmail?._id?.toString() !== userId) {
    throw new ConflictError("Please try a different email address");
  }
  /* check if the userId is the same as the one passed and update the user */
  const filtersUpdate = { school_id: school_id, _id: userId };
  const newUser = {
    school_id: school_id,
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
    role: role,
    status: status,
    hasTeachingFunc: hasTeachingFunc,
  };
  const fieldUpdated = await modifyFilterUser(filtersUpdate, newUser);
  if (!fieldUpdated) {
    throw new NotFoundError("User not updated");
  }
  res.status(StatusCodes.OK).json({ msg: "User updated" });
};

// @desc delete a user
// @route DELETE /api/v1/users/:id
// @access Private
// @fields: params: {id:[string]},  body: {school_id:[string]}
const deleteUser = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields */
  const { id: userId } = params;
  const { school_id } = body;
  /* delete the user */
  const filtersDelete = { _id: userId, school_id: school_id };
  const userDeleted = await removeFilterUser(filtersDelete);
  if (!userDeleted) {
    throw new NotFoundError("User not deleted");
  }
  res.status(StatusCodes.OK).json({ msg: "User deleted" });
};

export { createUser, getUsers, getUser, updateUser, deleteUser };
