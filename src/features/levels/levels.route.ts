import { Router } from "express";
import {
  validateCreateLevel,
  validateGetLevels,
  validateGetLevel,
  validateDeleteLevel,
  validateUpdateLevel,
} from "./levels.validator";

import {
  createLevel,
  getLevels,
  getLevel,
  updateLevel,
  deleteLevel,
} from "./levels.controller";

export const router = Router();

// @desc    Create a level
// @route   POST /api/v?/levels
// @access  Private
router.post("/", validateCreateLevel, createLevel);

// @desc    Get levels data
// @route   GET /api/v?/levels
// @access  Private
router.get("/", validateGetLevels, getLevels);

// @desc    Get a level data
// @route   GET /api/v?/levels/:id
// @access  Private
router.get("/:id", validateGetLevel, getLevel);

// @desc    Update a level data
// @route   PUT /api/v?/levels/:id
// @access  Private
router.put("/:id", validateUpdateLevel, updateLevel);

// @desc    Delete a level data
// @route   PUT /api/v?/levels/:id
// @access  Private
router.delete("/:id", validateDeleteLevel, deleteLevel);
