DECLARE
    v_column_count NUMBER;
BEGIN
    SELECT COUNT(*)
      INTO v_column_count
      FROM user_tab_columns
     WHERE table_name = 'FEEDBACK'
       AND column_name = 'REVIEW_STATUS';

    IF v_column_count > 0 THEN
        EXECUTE IMMEDIATE 'ALTER TABLE feedback DROP COLUMN review_status CASCADE CONSTRAINTS';
    END IF;
END;
/
