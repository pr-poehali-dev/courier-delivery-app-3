import { useState } from "react";
import Icon from "@/components/ui/icon";

interface CourierProfile {
  name: string;
  phone: string;
  city: string;
  vehicle: string;
  plateNumber: string;
  experience: string;
  rating: string;
  workingHours: string;
  zones: string;
  about: string;
}

const INITIAL_PROFILE: CourierProfile = {
  name: "Алексей Смирнов",
  phone: "+7 (912) 345-67-89",
  city: "Ижевск",
  vehicle: "Автомобиль",
  plateNumber: "А123БВ 18",
  experience: "3 года",
  rating: "4.9",
  workingHours: "08:00 — 22:00",
  zones: "Центр, Металлург, Автозавод",
  about: "Ответственный курьер, всегда на связи",
};

export function ProfileTab() {
  const [profile, setProfile] = useState<CourierProfile>(INITIAL_PROFILE);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<CourierProfile>({ ...INITIAL_PROFILE });

  const set = <K extends keyof CourierProfile>(k: K, v: CourierProfile[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const save = () => {
    setProfile({ ...form });
    setEditing(false);
  };

  const cancel = () => {
    setForm({ ...profile });
    setEditing(false);
  };

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      {/* Avatar + name */}
      <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-2xl font-bold text-primary-foreground">
          {profile.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-lg font-bold text-foreground leading-tight">{profile.name}</p>
          <p className="text-sm text-muted-foreground">{profile.phone}</p>
          <div className="flex items-center gap-1 mt-1">
            <Icon name="Star" size={13} className="text-yellow-500" />
            <span className="text-sm font-semibold text-foreground">{profile.rating}</span>
            <span className="text-xs text-muted-foreground ml-1">· {profile.city}</span>
          </div>
        </div>
        <button
          onClick={() => setEditing(true)}
          className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0"
        >
          <Icon name="Pencil" size={15} className="text-muted-foreground" />
        </button>
      </div>

      {/* Info blocks */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3 border-b border-border">
          Транспорт
        </p>
        <div className="divide-y divide-border">
          <ProfileRow icon="Car" label="Тип" value={profile.vehicle} />
          <ProfileRow icon="Hash" label="Номер" value={profile.plateNumber} />
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3 border-b border-border">
          Работа
        </p>
        <div className="divide-y divide-border">
          <ProfileRow icon="Clock" label="Часы" value={profile.workingHours} />
          <ProfileRow icon="Briefcase" label="Стаж" value={profile.experience} />
          <ProfileRow icon="MapPin" label="Зоны" value={profile.zones} />
        </div>
      </div>

      {profile.about && (
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">О себе</p>
          <p className="text-sm text-foreground">{profile.about}</p>
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-end animate-fade-in"
          onClick={cancel}
        >
          <div
            className="bg-card w-full max-h-[92vh] rounded-t-2xl overflow-y-auto"
            style={{ animation: "slideUp 0.3s ease-out" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-card border-b border-border px-4 py-4 flex items-center justify-between z-10">
              <h2 className="text-base font-bold text-foreground">Редактировать профиль</h2>
              <button onClick={cancel} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <Icon name="X" size={16} className="text-muted-foreground" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <ProfileField label="Имя" icon="User">
                <input className="field-input" value={form.name} onChange={(e) => set("name", e.target.value)} />
              </ProfileField>

              <ProfileField label="Телефон" icon="Phone">
                <input className="field-input" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
              </ProfileField>

              <ProfileField label="Город" icon="MapPin">
                <input className="field-input" value={form.city} onChange={(e) => set("city", e.target.value)} />
              </ProfileField>

              <div className="grid grid-cols-2 gap-3">
                <ProfileField label="Транспорт" icon="Car">
                  <input className="field-input" value={form.vehicle} onChange={(e) => set("vehicle", e.target.value)} />
                </ProfileField>
                <ProfileField label="Номер авто" icon="Hash">
                  <input className="field-input" value={form.plateNumber} onChange={(e) => set("plateNumber", e.target.value)} />
                </ProfileField>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <ProfileField label="Стаж" icon="Briefcase">
                  <input className="field-input" value={form.experience} onChange={(e) => set("experience", e.target.value)} />
                </ProfileField>
                <ProfileField label="Рейтинг" icon="Star">
                  <input className="field-input" value={form.rating} onChange={(e) => set("rating", e.target.value)} />
                </ProfileField>
              </div>

              <ProfileField label="Рабочие часы" icon="Clock">
                <input className="field-input" value={form.workingHours} onChange={(e) => set("workingHours", e.target.value)} placeholder="08:00 — 22:00" />
              </ProfileField>

              <ProfileField label="Зоны доставки" icon="Map">
                <input className="field-input" value={form.zones} onChange={(e) => set("zones", e.target.value)} placeholder="Центр, Металлург..." />
              </ProfileField>

              <ProfileField label="О себе" icon="MessageSquare">
                <textarea
                  className="field-input resize-none"
                  rows={2}
                  value={form.about}
                  onChange={(e) => set("about", e.target.value)}
                  placeholder="Расскажите о себе..."
                />
              </ProfileField>

              <div className="flex gap-2 pt-2">
                <button onClick={cancel} className="flex-1 bg-muted text-foreground rounded-xl py-3 text-sm font-medium">
                  Отмена
                </button>
                <button onClick={save} className="flex-1 bg-primary text-primary-foreground rounded-xl py-3 text-sm font-semibold">
                  Сохранить
                </button>
              </div>
              <div className="h-4" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-2">
        <Icon name={icon} size={14} className="text-muted-foreground" />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

function ProfileField({ label, icon, children }: { label: string; icon: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
        <Icon name={icon} size={11} />
        {label}
      </label>
      {children}
    </div>
  );
}
