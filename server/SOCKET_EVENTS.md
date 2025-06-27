# Socket.IO Event Naming Conventions

This document outlines the naming conventions for Socket.IO events in the SeedSync application.

## General Principles

- **Clarity and Consistency**: Event names should be clear, descriptive, and consistent across the application.
- **Verb-based**: Use verbs to indicate the action being performed (e.g., `create`, `update`, `delete`).
- **Namespace-based**: Use namespaces to group related events (e.g., `trade:create`, `trade:update`).

## Event Structure

Events should be structured as follows:

`[namespace]:[action]`

- `namespace`: The feature or resource the event relates to (e.g., `trade`, `review`, `match`).
- `action`: The action being performed (e.g., `create`, `update`, `delete`, `notify`).

## Example Events

- `trade:create`: A new trade has been created.
- `trade:update`: A trade has been updated.
- `review:create`: A new review has been created.
- `match:notify`: A new match has been found for a user.
- `notification:new`: A new notification has been sent to a user.
