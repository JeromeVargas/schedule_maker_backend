import { NextFunction, Request, Response } from "express";
import { check } from "express-validator";
import validateResult from "../../lib/helpers/validateHelper";
import { isValidId } from "../../lib/utilities/utils";

// @fields: body: {school_id:[string], coordinator_id:[string], group_id:[string], coordinator_id:[string], field_id:[string], name:[string], classUnits:[number], frequency:[number]}
const validateCreateSubject = [
  check("school_id")
    .exists()
    .withMessage("Please add the school id")
    .bail()
    .notEmpty()
    .withMessage("The school id field is empty")
    .bail()
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The school id is not valid`),
  check("coordinator_id")
    .exists()
    .withMessage("Please add the coordinator id")
    .bail()
    .notEmpty()
    .withMessage("The coordinator id field is empty")
    .bail()
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The coordinator id is not valid`),
  check("group_id")
    .exists()
    .withMessage("Please add the group id")
    .bail()
    .notEmpty()
    .withMessage("The group id field is empty")
    .bail()
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The group id is not valid`),
  check("field_id")
    .exists()
    .withMessage("Please add the field id")
    .bail()
    .notEmpty()
    .withMessage("The field id field is empty")
    .bail()
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The field id is not valid`),
  check("name")
    .exists()
    .withMessage("Please add a subject name")
    .bail()
    .notEmpty()
    .withMessage("The subject name field is empty")
    .bail()
    .isString()
    .withMessage("The subject name is not valid")
    .isLength({ min: 1, max: 100 })
    .withMessage("The subject name must not exceed 100 characters")
    .escape()
    .trim(),
  check("classUnits")
    .exists()
    .withMessage("Please add the number of class units")
    .bail()
    .notEmpty()
    .withMessage("The number of class units field is empty")
    .bail()
    .isInt({ min: 0 })
    .withMessage("number of class units value is not valid")
    .isLength({ min: 1, max: 9 })
    .withMessage("The number of class units must not exceed 9 digits"),
  check("frequency")
    .exists()
    .withMessage("Please add the subject class frequency")
    .bail()
    .notEmpty()
    .withMessage("The subject class frequency field is empty")
    .bail()
    .isInt({ min: 0 })
    .withMessage("subject class frequency value is not valid")
    .isLength({ min: 1, max: 9 })
    .withMessage("The subject class frequency must not exceed 9 digits"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

// @fields: body: {school_id:[string]}
const validateGetSubjects = [
  check("school_id")
    .exists()
    .withMessage("Please add a school id")
    .bail()
    .notEmpty()
    .withMessage("The school id field is empty")
    .bail()
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The school id is not valid`),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

// @fields: params: {id:[string]},  body: {school_id:[string]}
const validateGetSubject = [
  check("id")
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The subject id is not valid`),
  check("school_id")
    .exists()
    .withMessage("Please add a school id")
    .bail()
    .notEmpty()
    .withMessage("The school id field is empty")
    .bail()
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The school id is not valid`),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

// @fields: params: {id:[string]},  body: {school_id:[string], coordinator_id:[string], group_id:[string], coordinator_id:[string], field_id:[string], name:[string], classUnits:[number], frequency:[number]}
const validateUpdateSubject = [
  check("id")
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The subject id is not valid`),
  check("school_id")
    .exists()
    .withMessage("Please add the school id")
    .bail()
    .notEmpty()
    .withMessage("The school id field is empty")
    .bail()
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The school id is not valid`),
  check("coordinator_id")
    .exists()
    .withMessage("Please add the coordinator id")
    .bail()
    .notEmpty()
    .withMessage("The coordinator id field is empty")
    .bail()
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The coordinator id is not valid`),
  check("group_id")
    .exists()
    .withMessage("Please add the group id")
    .bail()
    .notEmpty()
    .withMessage("The group id field is empty")
    .bail()
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The group id is not valid`),
  check("field_id")
    .exists()
    .withMessage("Please add the field id")
    .bail()
    .notEmpty()
    .withMessage("The field id field is empty")
    .bail()
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The field id is not valid`),
  check("name")
    .exists()
    .withMessage("Please add a subject name")
    .bail()
    .notEmpty()
    .withMessage("The subject name field is empty")
    .bail()
    .isString()
    .withMessage("The subject name is not valid")
    .isLength({ min: 1, max: 100 })
    .withMessage("The subject name must not exceed 100 characters")
    .escape()
    .trim(),
  check("classUnits")
    .exists()
    .withMessage("Please add the number of class units")
    .bail()
    .notEmpty()
    .withMessage("The number of class units field is empty")
    .bail()
    .isInt({ min: 0 })
    .withMessage("number of class units value is not valid")
    .isLength({ min: 1, max: 9 })
    .withMessage("The number of class units must not exceed 9 digits"),
  check("frequency")
    .exists()
    .withMessage("Please add the subject class frequency")
    .bail()
    .notEmpty()
    .withMessage("The subject class frequency field is empty")
    .bail()
    .isInt({ min: 0 })
    .withMessage("subject class frequency value is not valid")
    .isLength({ min: 1, max: 9 })
    .withMessage("The subject class frequency must not exceed 9 digits"),
  // code
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

// @fields: params: {id:[string]},  body: {school_id:[string]}
const validateDeleteSubject = [
  check("id")
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The subject id is not valid`),
  check("school_id")
    .exists()
    .withMessage("Please add a school id")
    .bail()
    .notEmpty()
    .withMessage("The school id field is empty")
    .bail()
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The school id is not valid`),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export {
  validateCreateSubject,
  validateGetSubjects,
  validateGetSubject,
  validateUpdateSubject,
  validateDeleteSubject,
};
