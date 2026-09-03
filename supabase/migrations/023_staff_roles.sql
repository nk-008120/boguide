alter table public.profiles
  add column if not exists is_staff boolean not null default false;
update public.profiles
set is_staff = true
where id in (
  '540e0a17-171f-455c-9adf-d1a9f9689512',
  '4aae1d20-d168-43dd-836e-1de2ae8a569e',
  'b77ab143-5a8a-46b2-91fa-1fafc0e69947',
  'b05bb84e-58fa-445d-a73f-787cd38d0163',
  'ca6261cb-ce32-4577-9bf1-76c78fd60a08'
);
