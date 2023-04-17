import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../errors/bad-request";
import ConflictError from "../errors/conflict";
import NotFoundError from "../errors/not-found";

import {
  insertResource,
  findFilterAllResources,
  findResourceById,
  findResourceByProperty,
  updateFilterResource,
  deleteFilterResource,
  findFilterResourceByProperty,
} from "../services/mongoServices";

// @desc create a user
// @route POST /api/v1/users
// @access Private
// @fields: body: {firstName:[string], lastName:[string], school_id:[string], email:[string], password:[string], role:[string], status:[string], hasTeachingFunc:[boolean]}
const createUser = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const { school_id, email } = body;
  /* check if the school exists */
  const schoolModel = "school";
  const schoolSearchCriteria = school_id;
  const schoolFieldsToReturn = "-createdAt -updatedAt";
  const existingSchool = await findResourceById(
    schoolSearchCriteria,
    schoolFieldsToReturn,
    schoolModel
  );
  if (!existingSchool) {
    throw new ConflictError("Please create the school first");
  }
  /* check if the email is already in use */
  const searchCriteria = { email };
  const fieldsToReturn = "-password -createdAt -updatedAt";
  const model = "user";
  const duplicatedUserEmailFound = await findResourceByProperty(
    searchCriteria,
    fieldsToReturn,
    model
  );
  if (duplicatedUserEmailFound) {
    throw new ConflictError("Please try a different email address");
  }
  /* create the user */
  const userCreated = await insertResource(body, model);
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
  const model = "user";
  const fieldsToReturn = "-createdAt -updatedAt";
  const usersFound = await findFilterAllResources(
    filters,
    fieldsToReturn,
    model
  );
  /* get all fields */
  if (usersFound?.length === 0) {
    throw new NotFoundError("No users found");
  }
  res.status(StatusCodes.OK).json(usersFound);
};

// @desc get the user by id
// @route GET /api/v1/users/:id
// @access Private
// @fields: params: {id:[string]},  body: {school_id:[string], name:[string], prevName:[string]}
const getUser = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields */
  const { id: userId } = params;
  const { school_id } = body;
  /* get the user */
  const filters = [{ _id: userId }, { school_id: school_id }];
  const fieldsToReturn = "-password -createdAt -updatedAt";
  const model = "user";
  const userFound = await findFilterResourceByProperty(
    filters,
    fieldsToReturn,
    model
  );
  if (userFound?.length === 0) {
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
  const { school_id, email } = body;
  /* check if the user email is already in use by another user */
  const searchCriteria = { email };
  const fieldsToReturn = "-password -createdAt -updatedAt";
  const model = "user";
  const duplicatedEmail = await findResourceByProperty(
    searchCriteria,
    fieldsToReturn,
    model
  );
  if (duplicatedEmail && duplicatedEmail?._id?.toString() !== userId) {
    throw new ConflictError("Please try a different email address");
  }
  /* check if the field is the same as the one passed and update the user */
  const filtersUpdate = [{ _id: userId }, { school_id: school_id }];
  const newUser = body;
  const fieldUpdated = await updateFilterResource(
    filtersUpdate,
    newUser,
    model
  );
  if (!fieldUpdated) {
    throw new NotFoundError("User not updated");
  }
  res.status(StatusCodes.OK).json({ msg: "User updated" });
};

// @desc delete a user
// @route DELETE /api/v1/users/:id
// @access Private
// @fields: params: {id:[string]},  body: {school_id:[string], name:[string], prevName:[string]}
const deleteUser = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields */
  const { id: userId } = params;
  const { school_id } = body;
  /* delete the user */
  const filtersDelete = { _id: userId, school_id: school_id };
  const model = "user";
  const userDeleted = await deleteFilterResource(filtersDelete, model);
  if (!userDeleted) {
    throw new NotFoundError("User not deleted");
  }
  res.status(StatusCodes.OK).json({ msg: "User deleted" });
};

export { createUser, getUsers, getUser, updateUser, deleteUser };