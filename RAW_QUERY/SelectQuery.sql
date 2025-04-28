INSERT INTO "SELECT 
    e.id AS employee_id,
    e.nik,
    e.name,
    e.is_active,
    ep.gender,
    CONCAT(EXTRACT(YEAR FROM AGE(CURRENT_DATE, ep.date_of_birth)), ' Years Old') AS age,
    ed.name AS school_name,
    ed.level,
    CASE 
        WHEN COUNT(ef.id) = 0 THEN '-'
        ELSE
            TRIM(
                BOTH ' & ' FROM
                CONCAT(
                    CASE WHEN COUNT(CASE WHEN ef.relation_status = 'Istri' THEN 1 END) > 0
                         THEN COUNT(CASE WHEN ef.relation_status = 'Istri' THEN 1 END) || ' Istri & '
                         ELSE '' END,
                    CASE WHEN COUNT(CASE WHEN ef.relation_status = 'Anak' THEN 1 END) > 0
                         THEN COUNT(CASE WHEN ef.relation_status = 'Anak' THEN 1 END) || ' Anak & '
                         ELSE '' END
                )
            )
    END AS family_data
FROM 
    ""Employees"" e
LEFT JOIN 
    ""EmployeeProfiles"" ep ON e.id = ep.employee_id
LEFT JOIN 
    ""Educations"" ed ON e.id = ed.employee_id
LEFT JOIN 
    ""EmployeeFamilies"" ef ON e.id = ef.employee_id
GROUP BY 
    e.id, e.nik, e.name, e.is_active, ep.gender, ep.date_of_birth, ed.name, ed.level
ORDER BY 
    e.id
" (nik,"name",is_active,gender,age,school_name,"level",family_data) VALUES
	 ('11012','Budi',true,'Laki-Laki'::public."enum_EmployeeProfiles_gender",'27 Years Old','SMKN 7 Jakarta','SMA'::public."enum_Educations_level",'1 Istri & 2 Anak'),
	 ('11013','Jarot',true,'Laki-Laki'::public."enum_EmployeeProfiles_gender",'27 Years Old','Universitas Negeri Jakarta','Strata 1'::public."enum_Educations_level",'-');
