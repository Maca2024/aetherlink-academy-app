-- Hand-authored, same reasoning as 0001_immutability_triggers.sql: a room's
-- pin must name a published revision, and once created a room never mutates.
CREATE FUNCTION "academy_curriculum"."forbid_room_pin_on_unpublished"() RETURNS trigger AS $$
DECLARE
  pinned_published boolean;
BEGIN
  SELECT (status = 'published') INTO pinned_published
  FROM "academy_curriculum"."course_versions"
  WHERE course_id = NEW.course_id AND version = NEW.pinned_version
  FOR SHARE;
  IF NOT COALESCE(pinned_published, false) THEN
    RAISE EXCEPTION 'room % cannot pin unpublished course % v%', NEW.id, NEW.course_id, NEW.pinned_version
      USING ERRCODE = '23001';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint
CREATE TRIGGER "rooms_pin_published"
  BEFORE INSERT ON "academy_curriculum"."rooms"
  FOR EACH ROW EXECUTE FUNCTION "academy_curriculum"."forbid_room_pin_on_unpublished"();
--> statement-breakpoint
CREATE FUNCTION "academy_curriculum"."forbid_room_mutation"() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'room % is immutable once created', OLD.id
    USING ERRCODE = '23001';
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint
CREATE TRIGGER "rooms_immutable"
  BEFORE UPDATE OR DELETE ON "academy_curriculum"."rooms"
  FOR EACH ROW EXECUTE FUNCTION "academy_curriculum"."forbid_room_mutation"();
