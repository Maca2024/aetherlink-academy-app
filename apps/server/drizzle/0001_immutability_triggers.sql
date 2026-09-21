-- Hand-authored: enforces publication immutability at the database level, not
-- only in application code. drizzle-orm's schema DSL has no trigger support,
-- so this file is not generated from schema.ts; it is tracked in the journal
-- like any other migration and applied by the same migrator.
--
-- BEFORE UPDATE triggers must RETURN NEW to let an allowed write proceed;
-- returning OLD silently discards it. DELETE triggers return OLD (there is
-- no NEW). Every function below follows that rule.
CREATE FUNCTION "academy_curriculum"."forbid_mutate_published_version"() RETURNS trigger AS $$
BEGIN
  IF TG_OP IN ('UPDATE', 'DELETE') AND OLD.status = 'published' THEN
    RAISE EXCEPTION 'academy_curriculum.course_versions % v% is published and immutable', OLD.course_id, OLD.version
      USING ERRCODE = '23001';
  END IF;
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint
CREATE TRIGGER "course_versions_immutable"
  BEFORE UPDATE OR DELETE ON "academy_curriculum"."course_versions"
  FOR EACH ROW EXECUTE FUNCTION "academy_curriculum"."forbid_mutate_published_version"();
--> statement-breakpoint
-- Covers INSERT, UPDATE and DELETE: a row cannot be created or moved into an
-- already-published revision, and a row already in a published revision
-- cannot be changed or removed. The `FOR SHARE` read takes a row lock on the
-- referenced course_versions row, so it serializes against a concurrent
-- `publish()` transaction's `UPDATE course_versions SET status = 'published'
-- ...` (which needs an exclusive lock on that same row) instead of racing it.
CREATE FUNCTION "academy_curriculum"."forbid_mutate_published_content"() RETURNS trigger AS $$
DECLARE
  old_published boolean;
  new_published boolean;
BEGIN
  IF TG_OP IN ('UPDATE', 'DELETE') THEN
    SELECT (status = 'published') INTO old_published
    FROM "academy_curriculum"."course_versions"
    WHERE course_id = OLD.course_id AND version = OLD.version
    FOR SHARE;
    IF old_published THEN
      RAISE EXCEPTION '% row in published course % v% is immutable', TG_TABLE_NAME, OLD.course_id, OLD.version
        USING ERRCODE = '23001';
    END IF;
  END IF;
  IF TG_OP IN ('INSERT', 'UPDATE') THEN
    SELECT (status = 'published') INTO new_published
    FROM "academy_curriculum"."course_versions"
    WHERE course_id = NEW.course_id AND version = NEW.version
    FOR SHARE;
    IF new_published THEN
      RAISE EXCEPTION 'cannot write % into published course % v%', TG_TABLE_NAME, NEW.course_id, NEW.version
        USING ERRCODE = '23001';
    END IF;
  END IF;
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint
CREATE TRIGGER "tracks_content_immutable"
  BEFORE INSERT OR UPDATE OR DELETE ON "academy_curriculum"."tracks"
  FOR EACH ROW EXECUTE FUNCTION "academy_curriculum"."forbid_mutate_published_content"();
--> statement-breakpoint
CREATE TRIGGER "days_content_immutable"
  BEFORE INSERT OR UPDATE OR DELETE ON "academy_curriculum"."days"
  FOR EACH ROW EXECUTE FUNCTION "academy_curriculum"."forbid_mutate_published_content"();
--> statement-breakpoint
CREATE TRIGGER "lessons_content_immutable"
  BEFORE INSERT OR UPDATE OR DELETE ON "academy_curriculum"."lessons"
  FOR EACH ROW EXECUTE FUNCTION "academy_curriculum"."forbid_mutate_published_content"();
--> statement-breakpoint
CREATE TRIGGER "slides_content_immutable"
  BEFORE INSERT OR UPDATE OR DELETE ON "academy_curriculum"."slides"
  FOR EACH ROW EXECUTE FUNCTION "academy_curriculum"."forbid_mutate_published_content"();
--> statement-breakpoint
CREATE TRIGGER "assignments_content_immutable"
  BEFORE INSERT OR UPDATE OR DELETE ON "academy_curriculum"."assignments"
  FOR EACH ROW EXECUTE FUNCTION "academy_curriculum"."forbid_mutate_published_content"();
--> statement-breakpoint
CREATE TRIGGER "quiz_questions_content_immutable"
  BEFORE INSERT OR UPDATE OR DELETE ON "academy_curriculum"."quiz_questions"
  FOR EACH ROW EXECUTE FUNCTION "academy_curriculum"."forbid_mutate_published_content"();
