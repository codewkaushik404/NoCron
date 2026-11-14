-- CreateIndex
CREATE INDEX "Action_action_type_id_idx" ON "Action"("action_type_id");

-- CreateIndex
CREATE INDEX "Execution_workflow_id_idx" ON "Execution"("workflow_id");

-- CreateIndex
CREATE INDEX "Trigger_trigger_type_id_idx" ON "Trigger"("trigger_type_id");

-- CreateIndex
CREATE INDEX "Workflow_user_id_updated_at_idx" ON "Workflow"("user_id", "updated_at" DESC);
