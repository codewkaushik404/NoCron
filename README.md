# NoCron

NoCron is a visual workflow automation platform designed to simplify task automation for users who may not have extensive technical knowledge.

Instead of writing cron jobs, scripts, or manually configuring multiple AWS services, users can build workflows visually by connecting different nodes and deploy them as automated workflows.

## What It Does

NoCron allows users to:

* Build workflows using a visual node-based interface
* Configure triggers such as scheduled execution and webhooks
* Add actions such as sending emails and waiting between steps
* Define workflow logic using nodes and edges
* Preview the generated AWS Step Functions definition
* Deploy workflows through a backend API
* Trigger workflows through generated webhook endpoints
* View execution/test logs from the interface

## Architecture

### Frontend

* React
* Recoil
* Node-based workflow editor
* JavaScript/TypeScript

The frontend maintains workflow state such as nodes, edges, workflow metadata, deployment status, and execution logs.

### Backend

* Node.js
* Express
* Zod
* AWS SDK
* DynamoDB

The backend validates workflow payloads, stores workflow configurations, and handles deployment/execution-related operations.

### AWS Services

* **AWS Step Functions** — orchestrates workflow execution
* **Amazon EventBridge Scheduler** — handles scheduled workflow execution
* **Amazon SES** — sends emails from workflows
* **Amazon DynamoDB** — stores workflow configurations
* **AWS IAM** — manages permissions between services

## Workflow Structure

A workflow consists primarily of:

```text
Nodes + Edges
     ↓
Workflow Configuration
     ↓
Backend
     ↓
AWS Step Functions
     ↓
Automated Execution
```

The `node_config` contains the workflow's `nodes` and `edges`, which represent the actual workflow structure. The backend uses this configuration when storing and deploying the workflow.

The user builds this visually without having to manually create a cron job or write the orchestration logic themselves.

## Goal

The main goal of NoCron is to bridge the gap between technical automation infrastructure and non-technical users by providing a simpler visual interface for creating and deploying automated workflows.

## Status

NoCron is a working prototype demonstrating visual workflow creation, backend workflow management, and integration with AWS services for automated execution.
