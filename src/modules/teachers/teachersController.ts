import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../../errors/bad-request";
import ConflictError from "../../errors/conflict";
import NotFoundError from "../../errors/not-found";

import { User } from "../../typings/types";
import {
  insertTeacher,
  findTeacherByProperty,
  findFilterAllTeachers,
  modifyFilterTeacher,
  removeFilterTeacher,
  /* Services from other entities */
  findPopulateFilterAllUsers,
  findUserByProperty,
} from "./teacherServices";

/* models */
const userModel = "user";
const teacherModel = "teacher";

/* global reference */
const maxHours = 70; // number of hours in a week

// @desc create a user
// @route POST /api/v1/teachers
// @access Private
// @fields: body: {user_id: [string];  coordinator_id: [string];  contractType: [string];  hoursAssignable: [number];  hoursAssigned: [number], monday: [boolean], tuesday: [boolean], wednesday: [boolean], thursday: [boolean], friday: [boolean], saturday: [boolean], sunday: [boolean]}
const createTeacher = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const {
    school_id,
    coordinator_id,
    user_id,
    contractType,
    hoursAssignable,
    hoursAssigned,
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday,
  } = body;
  /* check if hours assignable do not exceed the max allowed number of hours */
  if (hoursAssignable > maxHours) {
    throw new BadRequestError(
      `hours assignable must not exceed ${maxHours} hours`
    );
  }
  /* check if hours assigned do not exceed the hours assignable */
  if (hoursAssigned > hoursAssignable) {
    throw new BadRequestError(
      `hours assigned must not exceed the hours assignable, ${hoursAssignable} hours`
    );
  }
  /* check if the user is already a teacher */
  const teacherSearchCriteria = { school_id, user_id };
  const teacherFieldsToReturn = "-createdAt -updatedAt";
  const existingTeacher = await findTeacherByProperty(
    teacherSearchCriteria,
    teacherFieldsToReturn
  );
  if (existingTeacher) {
    throw new ConflictError("User is already a teacher");
  }
  /* check if the user exists, is active and has teaching functions */
  const userSearchCriteria = [coordinator_id, user_id];
  const userFieldsToReturn = "-password -createdAt -updatedAt";
  const userFieldsToPopulate = "school_id";
  const userFieldsToReturnPopulate = "-createdAt -updatedAt";
  const existingUserCoordinator = await findPopulateFilterAllUsers(
    userSearchCriteria,
    userFieldsToReturn,
    userFieldsToPopulate,
    userFieldsToReturnPopulate
  );
  // if there is not at least one record with an existing user id property, it returns false and triggers an error
  const existingUser = existingUserCoordinator?.find(
    (user: User) => user?._id?.toString() === user_id
  );
  if (!existingUser) {
    throw new BadRequestError("Please create the base user first");
  }
  if (existingUser.status !== "active") {
    throw new BadRequestError("The user is not active");
  }
  if (existingUser.hasTeachingFunc !== true) {
    throw new BadRequestError(
      "The user does not have teaching functions assigned"
    );
  }
  // check if the user school exists/
  if (existingUser?.school_id?._id.toString() !== school_id) {
    throw new BadRequestError("Please make sure the user's school is correct");
  }
  /* check if the coordinator exists, has a coordinator role and it is active */
  // if there is not at least one record with an existing coordinator id property, it returns false and triggers an error
  const existingCoordinator = existingUserCoordinator?.find(
    (user: User) => user?._id?.toString() === coordinator_id
  );
  if (!existingCoordinator) {
    throw new BadRequestError("Please pass an existent coordinator");
  }
  if (existingCoordinator?.role !== "coordinator") {
    throw new BadRequestError("Please pass a user with a coordinator role");
  }
  if (existingCoordinator?.status !== "active") {
    throw new BadRequestError("Please pass an active coordinator");
  }
  // check if the coordinator school exists/
  if (existingCoordinator?.school_id?._id.toString() !== school_id) {
    throw new BadRequestError(
      "Please make sure the coordinator's school is correct"
    );
  }
  /* create the teacher */
  const newTeacher = {
    school_id: school_id,
    coordinator_id: coordinator_id,
    user_id: user_id,
    contractType: contractType,
    hoursAssignable: hoursAssignable,
    hoursAssigned: hoursAssigned,
    monday: monday,
    tuesday: tuesday,
    wednesday: wednesday,
    thursday: thursday,
    friday: friday,
    saturday: saturday,
    sunday: sunday,
  };
  const teacherCreated = await insertTeacher(newTeacher);
  if (!teacherCreated) {
    throw new BadRequestError("Teacher not created");
  }
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Teacher created successfully!" });
};

// @desc get all the users
// @route GET /api/v1/teachers
// @access Private
// @fields: body: {school_id:[string]}
const getTeachers = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const { school_id } = body;
  /* filter by school id */
  const filters = { school_id };
  const fieldsToReturn = "-createdAt -updatedAt";
  const teachersFound = await findFilterAllTeachers(filters, fieldsToReturn);
  /* get all fields */
  if (teachersFound?.length === 0) {
    throw new NotFoundError("No teachers found");
  }
  res.status(StatusCodes.OK).json(teachersFound);
};

// @desc get the user by id
// @route GET /api/v1/teachers/:id
// @access Private
// @fields: params: {id:[string]},  body: {school_id:[string]}
const getTeacher = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields */
  const { id: _id } = params;
  const { school_id } = body;
  /* get the teacher */
  const searchCriteria = { school_id, _id };
  const fieldsToReturn = "-createdAt -updatedAt";
  const teacherFound = await findTeacherByProperty(
    searchCriteria,
    fieldsToReturn
  );
  if (!teacherFound) {
    throw new NotFoundError("Teacher not found");
  }
  res.status(StatusCodes.OK).json(teacherFound);
};

// @desc update a user
// @route PUT /api/v1/teachers/:id
// @access Private
// @fields: params: {id:[string]},  body: {user_id: [string];  coordinator_id: [string];  contractType: [string];  hoursAssignable: [number];  hoursAssigned: [number], monday: [boolean], tuesday: [boolean], wednesday: [boolean], thursday: [boolean], friday: [boolean], saturday: [boolean], sunday: [boolean]}
const updateTeacher = async ({ body, params }: Request, res: Response) => {
  /* destructure the fields */
  const { id: teacherId } = params;
  const {
    school_id,
    coordinator_id,
    user_id,
    contractType,
    hoursAssignable,
    hoursAssigned,
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday,
  } = body;
  /* check if hours assignable do not exceed the max allowed number of hours */
  if (hoursAssignable > maxHours) {
    throw new BadRequestError(
      `hours assignable must not exceed ${maxHours} hours`
    );
  }
  /* check if hours assigned do not exceed the hours assignable */
  if (hoursAssigned > hoursAssignable) {
    throw new BadRequestError(
      `hours assigned must not exceed the hours assignable, ${hoursAssignable} hours`
    );
  }
  /* check if coordinator exists, has the role and is active  */
  const coordinatorSearchCriteria = {
    school_id: school_id,
    _id: coordinator_id,
  };
  const coordinatorFieldsToReturn = "-password -createdAt -updatedAt";
  const existingCoordinator = await findUserByProperty(
    coordinatorSearchCriteria,
    coordinatorFieldsToReturn
  );
  if (!existingCoordinator) {
    throw new BadRequestError("Please pass an existent coordinator");
  }
  if (existingCoordinator?.role !== "coordinator") {
    throw new BadRequestError("Please pass a user with a coordinator role");
  }
  if (existingCoordinator?.status !== "active") {
    throw new BadRequestError("Please pass an active coordinator");
  }
  /* update if the teacher, user and school ids are the same one as the one passed and update the field */
  const filtersUpdate = {
    _id: teacherId,
    school_id: school_id,
    user_id: user_id,
  };
  const newTeacher = {
    school_id: school_id,
    coordinator_id: coordinator_id,
    user_id: user_id,
    contractType: contractType,
    hoursAssignable: hoursAssignable,
    hoursAssigned: hoursAssigned,
    monday: monday,
    tuesday: tuesday,
    wednesday: wednesday,
    thursday: thursday,
    friday: friday,
    saturday: saturday,
    sunday: sunday,
  };
  const teacherUpdated = await modifyFilterTeacher(filtersUpdate, newTeacher);
  if (!teacherUpdated) {
    throw new NotFoundError("Teacher not updated");
  }
  res.status(StatusCodes.OK).json({ msg: "Teacher updated" });
};

// @desc delete a user
// @route DELETE /api/v1/teachers/:id
// @access Private
// @fields: params: {id:[string]},  body: {school_id:[string]}
const deleteTeacher = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields */
  const { id: teacherId } = params;
  const { school_id } = body;
  /* delete teacher */
  const filtersDelete = { _id: teacherId, school_id: school_id };
  const fieldDeleted = await removeFilterTeacher(filtersDelete);
  if (!fieldDeleted) {
    throw new NotFoundError("Teacher not deleted");
  }
  res.status(StatusCodes.OK).json({ msg: "Teacher deleted" });
};

export { createTeacher, getTeachers, getTeacher, updateTeacher, deleteTeacher };