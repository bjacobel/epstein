insert into passengers(slug, name, biography, wikipedia_link, image)
values(
  :slug,
  $util.defaultIfNull(":name", ":slug"),
  nullif($util.defaultIfNull(":biography", ""), ''),
  nullif($util.defaultIfNull(":wikipedia_link", ""), ''),
  nullif($util.defaultIfNull(":image", ""), '')
)
on conflict (slug) do update set
  name = EXCLUDED.name,
  biography = EXCLUDED.biography,
  wikipedia_link = EXCLUDED.wikipedia_link,
  image = EXCLUDED.image

-- statementbreak

select * from passengers where slug = :slug
