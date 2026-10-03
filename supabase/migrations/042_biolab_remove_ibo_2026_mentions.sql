update public.biolab_practicals
set source_attribution = 'Trinder (iron-salicylate) colorimetric method'
where slug = 'aspirin-trinder'
  and source_attribution ~* 'IBO[[:space:]_-]*2026';

update public.biolab_practicals
set description = btrim(regexp_replace(description, '[[:space:]]*Modeled on the IBO[[:space:]_-]*2026 Animal Physiology practical exam\.?', '', 'gi'))
where slug = 'aspirin-trinder'
  and description ~* 'IBO[[:space:]_-]*2026';

update public.biolab_reference_results
set notes = regexp_replace(notes, 'the IBO[[:space:]_-]*2026 Animal Physiology reference standard', 'the reference standard', 'gi')
where notes ~* 'IBO[[:space:]_-]*2026';
