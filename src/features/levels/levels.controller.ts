import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../../errors/bad-request";
import ConflictError from "../../errors/conflict";
import NotFoundError from "../../errors/not-found";

import { Level } from "../../typings/types";
import {
  insertLevel,
  findFilterAllLevels,
  findLevelByProperty,
  findFilterLevelByProperty,
  findPopulateScheduleById,
  modifyFilterLevel,
  removeFilterLevel,
} from "./levels.services";

export const createLevel = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const { school_id, schedule_id, name } = body;
  /* check if the level name already exists for this school */
  const searchCriteria = { school_id, name };
  const fieldsToReturn = "-createdAt -updatedAt";
  const duplicateField = await findLevelByProperty(
    searchCriteria,
    fieldsToReturn
  );
  if (duplicateField) {
    throw new ConflictError("This level name already exists");
  }
  /* find schedule by id, and populate its properties */
  const fieldsToReturnSchedule = "-createdAt -updatedAt";
  const fieldsToPopulateSchedule = "school_id";
  const fieldsToReturnPopulateSchedule = "-createdAt -updatedAt";
  const scheduleFound = await findPopulateScheduleById(
    schedule_id,
    fieldsToReturnSchedule,
    fieldsToPopulateSchedule,
    fieldsToReturnPopulateSchedule
  );
  if (!scheduleFound) {
    throw new NotFoundError("Please make sure the schedule exists");
  }
  /* check if the passed school id is the same as the schedule school id*/
  if (scheduleFound?.school_id?._id?.toString() !== school_id) {
    throw new BadRequestError(
      "Please make sure the schedule belongs to the school"
    );
  }
  /* create level */
  const newLevel = {
    school_id: school_id,
    schedule_id: schedule_id,
    name: name,
  };
  const levelCreated = await insertLevel(newLevel);
  if (!levelCreated) {
    throw new BadRequestError("Level not created!");
  }
  res.status(StatusCodes.OK).json({ msg: "Level created!", success: true });
};

export const getLevels = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const { school_id } = body;
  /* filter by school id */
  const filters = { school_id: school_id };
  const fieldsToReturn = "-createdAt -updatedAt";
  const levelsFound = await findFilterAllLevels(filters, fieldsToReturn);
  /* get all fields */
  if (levelsFound?.length === 0) {
    throw new NotFoundError("No levels found");
  }
  res.status(StatusCodes.OK).json({
    payload: levelsFound,
    success: true,
  });
};

export const getLevel = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields */
  const { id: _id } = params;
  const { school_id } = body;
  /* get the level */
  const searchCriteria = { school_id, _id };
  const fieldsToReturn = "-createdAt -updatedAt";
  const levelFound = await findLevelByProperty(searchCriteria, fieldsToReturn);
  if (!levelFound) {
    throw new NotFoundError("Level not found");
  }
  res.status(StatusCodes.OK).json({
    payload: levelFound,
    success: true,
  });
};

export const updateLevel = async ({ params, body }: Request, res: Response) => {
  // /* destructure the fields */
  const { id: levelId } = params;
  const { school_id, schedule_id, name } = body;
  /* check if the level name already exist for the school */
  const filters = { school_id: school_id, name: name };
  const fieldsToReturn = "-createdAt -updatedAt";
  const duplicateLevelNameFound = await findFilterLevelByProperty(
    filters,
    fieldsToReturn
  );
  // if there is at least one record with that name and a different level id, it returns true and triggers an error
  const duplicateLevelName = duplicateLevelNameFound?.some(
    (level: Level) => level?._id?.toString() !== levelId
  );
  if (duplicateLevelName) {
    throw new ConflictError("This level name already exists!");
  }
  /* find schedule by id, and populate its properties */
  const fieldsToReturnSchedule = "-createdAt -updatedAt";
  const fieldsToPopulateSchedule = "school_id";
  const fieldsToReturnPopulateSchedule = "-createdAt -updatedAt";
  const scheduleFound = await findPopulateScheduleById(
    schedule_id,
    fieldsToReturnSchedule,
    fieldsToPopulateSchedule,
    fieldsToReturnPopulateSchedule
  );
  if (!scheduleFound) {
    throw new NotFoundError("Please make sure the schedule exists");
  }
  /* check if the passed school id is the same as the schedule school id*/
  if (scheduleFound?.school_id?._id?.toString() !== school_id) {
    throw new BadRequestError(
      "Please make sure the schedule belongs to the school"
    );
  }
  /* update level */
  const newLevel = {
    school_id: school_id,
    schedule_id: schedule_id,
    name: name,
  };
  const filtersUpdate = { _id: levelId, school_id: school_id };
  const levelUpdated = await modifyFilterLevel(filtersUpdate, newLevel);
  if (!levelUpdated) {
    throw new BadRequestError("Level not updated");
  }
  res.status(StatusCodes.OK).json({ msg: "Level updated!", success: true });
};

export const deleteLevel = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields from the params and body */
  const { id: levelId } = params;
  const { school_id } = body;
  /* delete level */
  const filtersDelete = { school_id: school_id, _id: levelId };
  const levelDeleted = await removeFilterLevel(filtersDelete);
  if (!levelDeleted) {
    throw new NotFoundError("Level not deleted");
  }
  res.status(StatusCodes.OK).json({ msg: "Level deleted", success: true });
};
