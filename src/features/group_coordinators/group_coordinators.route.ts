import { Router } from "express";
import {
  validateCreateGroupCoordinator,
  validateGetGroupCoordinators,
  validateGetGroupCoordinator,
  validateDeleteGroupCoordinator,
  validateUpdateGroupCoordinator,
} from "./group_coordinators.validator";

import {
  createGroupCoordinator,
  getGroupCoordinators,
  getGroupCoordinator,
  updateGroupCoordinator,
  deleteGroupCoordinator,
} from "./group_coordinators.controller";

export const router = Router();

// @desc    Create a teacher_field
// @route   POST /api/v?/teacher_fields
// @access  Private
router.post("/", validateCreateGroupCoordinator, createGroupCoordinator);

// @desc    Get teacher_fields data
// @route   GET /api/v?/teacher_fields
// @access  Private
router.get("/", validateGetGroupCoordinators, getGroupCoordinators);

// @desc    Get a teacher_field data
// @route   GET /api/v?/teacher_fields/:id
// @access  Private
router.get("/:id", validateGetGroupCoordinator, getGroupCoordinator);

// @desc    Update a teacher_field data
// @route   PUT /api/v?/teacher_fields/:id
// @access  Private
router.put("/:id", validateUpdateGroupCoordinator, updateGroupCoordinator);

// @desc    Delete a teacher_field data
// @route   PUT /api/v?/teacher_fields/:id
// @access  Private
router.delete("/:id", validateDeleteGroupCoordinator, deleteGroupCoordinator);
