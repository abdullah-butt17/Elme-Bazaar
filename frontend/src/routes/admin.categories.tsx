import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiSave,
} from "react-icons/fi";

import {
  AdminShell,
  AdminCard,
} from "@/components/admin/AdminShell";

import {
  adminStore,
  useAdminState,
  type CategoryEntry,
} from "@/store/adminStore";

export const Route = createFileRoute(
  "/admin/categories"
)({
  component: CategoriesPage,

  head: () => ({
    meta: [
      {
        title:
          "Categories — ELME Bazaar Admin",
      },
      {
        name: "robots",
        content: "noindex",
      },
    ],
  }),
});

/* =========================================================
   PAGE
========================================================= */

function CategoriesPage() {
  const { categories } =
    useAdminState();

  const [
    editing,
    setEditing,
  ] =
    useState<CategoryEntry | null>(
      null
    );

  const [
    creating,
    setCreating,
  ] = useState(false);

  const [
    deleteId,
    setDeleteId,
  ] =
    useState<string | null>(
      null
    );

  const elme =
    categories.filter(
      (category) =>
        category.main ===
        "ELME Bazaar"
    );

  const br =
    categories.filter(
      (category) =>
        category.main ===
        "BR Collection"
    );

  return (
    <AdminShell title="Categories">
      {/* HEADER */}

      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-[color:var(--ink-soft)]">
            {
              categories.length
            }{" "}
            category entries
          </p>
        </div>

        <button
          onClick={() =>
            setCreating(true)
          }
          className="btn-primary text-sm"
        >
          <FiPlus />

          Add Category
        </button>
      </div>

      {/* CATEGORY CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CategorySection
          title="ELME Bazaar"
          items={elme}
          onEdit={
            setEditing
          }
          onDelete={
            setDeleteId
          }
        />

        <CategorySection
          title="BR Collection"
          items={br}
          onEdit={
            setEditing
          }
          onDelete={
            setDeleteId
          }
        />
      </div>

      {/* MODALS */}

      <AnimatePresence>
        {(creating ||
          editing) && (
          <Modal
            title={
              creating
                ? "Add Category"
                : "Edit Category"
            }
            onClose={() => {
              setCreating(
                false
              );

              setEditing(
                null
              );
            }}
          >
            <CategoryFormBody
              initial={
                editing
              }
              onSave={(
                data
              ) => {
                if (
                  editing
                ) {
                  adminStore.updateCategory(
                    editing.id,
                    data
                  );
                } else {
                  adminStore.addCategory(
                    {
                      id: `cat-${Date.now()}`,
                      ...data,
                    }
                  );
                }

                setCreating(
                  false
                );

                setEditing(
                  null
                );
              }}
            />
          </Modal>
        )}

        {deleteId && (
          <Modal
            title="Delete category?"
            onClose={() =>
              setDeleteId(
                null
              )
            }
          >
            <p className="text-sm text-[color:var(--ink-soft)]">
              This will
              remove the
              category from
              the admin
              taxonomy.
              Existing
              products keep
              their labels.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setDeleteId(
                    null
                  )
                }
                className="px-5 py-2.5 rounded-full border border-border text-sm"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  adminStore.deleteCategory(
                    deleteId
                  );

                  setDeleteId(
                    null
                  );
                }}
                className="px-5 py-2.5 rounded-full bg-red-600 text-white text-sm hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </AdminShell>
  );
}

/* =========================================================
   CATEGORY SECTION
========================================================= */

function CategorySection({
  title,
  items,
  onEdit,
  onDelete,
}: {
  title: string;

  items: CategoryEntry[];

  onEdit: (
    category: CategoryEntry
  ) => void;

  onDelete: (
    id: string
  ) => void;
}) {
  /*
   * ELME currently does not use
   * collections, so keep its
   * existing simple list.
   */
  if (
    title ===
    "ELME Bazaar"
  ) {
    return (
      <AdminCard className="p-6">
        <h2 className="font-display text-xl text-[color:var(--emerald-deep)] mb-4">
          {title}
        </h2>

        <ul className="divide-y divide-border">
          {items.map(
            (category) => (
              <li
                key={
                  category.id
                }
                className="flex items-center justify-between py-3"
              >
                <span className="text-sm font-medium">
                  {
                    category.name
                  }
                </span>

                <CategoryActions
                  category={
                    category
                  }
                  onEdit={
                    onEdit
                  }
                  onDelete={
                    onDelete
                  }
                />
              </li>
            )
          )}

          {items.length ===
            0 && (
            <li className="py-6 text-center text-sm text-[color:var(--ink-soft)]">
              No categories
              yet.
            </li>
          )}
        </ul>
      </AdminCard>
    );
  }

  /*
   * BR COLLECTION
   *
   * Group database entries:
   *
   * Stitched
   *   2 Piece
   *   3 Piece
   *   Kurta
   *
   * Unstitched
   *   1 Piece
   *   2 Piece
   *   3 Piece
   */

  const grouped =
    items.reduce<
      Record<
        string,
        CategoryEntry[]
      >
    >(
      (
        result,
        category
      ) => {
        if (
          !result[
            category.name
          ]
        ) {
          result[
            category.name
          ] = [];
        }

        result[
          category.name
        ].push(
          category
        );

        return result;
      },
      {}
    );

  return (
    <AdminCard className="p-6">
      <h2 className="font-display text-xl text-[color:var(--emerald-deep)] mb-5">
        {title}
      </h2>

      {items.length ===
        0 && (
        <div className="py-6 text-center text-sm text-[color:var(--ink-soft)]">
          No categories
          yet.
        </div>
      )}

      <div className="space-y-6">
        {Object.entries(
          grouped
        ).map(
          ([
            categoryName,
            entries,
          ]) => (
            <div
              key={
                categoryName
              }
            >
              {/* SUB CATEGORY */}

              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-base font-semibold text-[color:var(--emerald-deep)]">
                  {
                    categoryName
                  }
                </h3>

                <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-[color:var(--cream)] text-[color:var(--ink-soft)]">
                  {
                    entries.length
                  }{" "}
                  collections
                </span>
              </div>

              {/* COLLECTIONS */}

              <div className="border border-border rounded-xl overflow-hidden">
                {entries.map(
                  (
                    category,
                    index
                  ) => (
                    <div
                      key={
                        category.id
                      }
                      className={`flex items-center justify-between px-4 py-3 ${
                        index !==
                        entries.length -
                          1
                          ? "border-b border-border"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--emerald-brand)]" />

                        <span className="text-sm">
                          {category.collection ||
                            "No collection"}
                        </span>
                      </div>

                      <CategoryActions
                        category={
                          category
                        }
                        onEdit={
                          onEdit
                        }
                        onDelete={
                          onDelete
                        }
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          )
        )}
      </div>
    </AdminCard>
  );
}

/* =========================================================
   ACTION BUTTONS
========================================================= */

function CategoryActions({
  category,
  onEdit,
  onDelete,
}: {
  category: CategoryEntry;

  onEdit: (
    category: CategoryEntry
  ) => void;

  onDelete: (
    id: string
  ) => void;
}) {
  return (
    <div className="flex gap-1">
      <button
        type="button"
        title="Edit"
        onClick={() =>
          onEdit(
            category
          )
        }
        className="p-2 rounded-lg hover:bg-[color:var(--cream)] text-[color:var(--emerald-brand)]"
      >
        <FiEdit2 />
      </button>

      <button
        type="button"
        title="Delete"
        onClick={() =>
          onDelete(
            category.id
          )
        }
        className="p-2 rounded-lg hover:bg-red-50 text-red-600"
      >
        <FiTrash2 />
      </button>
    </div>
  );
}

/* =========================================================
   ADD / EDIT CATEGORY FORM
========================================================= */

function CategoryFormBody({
  initial,
  onSave,
}: {
  initial:
    | CategoryEntry
    | null;

  onSave: (
    category: Omit<
      CategoryEntry,
      "id"
    >
  ) => void;
}) {
  const [
    main,
    setMain,
  ] = useState<
    CategoryEntry["main"]
  >(
    initial?.main ??
      "ELME Bazaar"
  );

  const [
    name,
    setName,
  ] = useState(
    initial?.name ?? ""
  );

  const [
    collection,
    setCollection,
  ] = useState(
    initial?.collection ??
      ""
  );

  const submit = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (
      !name.trim()
    ) {
      return;
    }

    onSave({
      main,

      name:
        name.trim(),

      collection:
        collection.trim(),
    });
  };

  return (
    <form
      onSubmit={
        submit
      }
      className="space-y-4"
    >
      {/* BRAND */}

      <label className="block">
        <span className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-soft)]">
          Brand
        </span>

        <select
          value={main}
          onChange={(
            event
          ) => {
            const next =
              event.target
                .value as CategoryEntry["main"];

            setMain(
              next
            );

            /*
             * BR Collection starts
             * with Stitched.
             */
            if (
              next ===
              "BR Collection"
            ) {
              setName(
                "Stitched"
              );
            } else {
              setName(
                ""
              );

              setCollection(
                ""
              );
            }
          }}
          className="mt-2 w-full px-3 py-2.5 rounded-lg border border-border bg-white text-sm outline-none"
        >
          <option value="ELME Bazaar">
            ELME Bazaar
          </option>

          <option value="BR Collection">
            BR Collection
          </option>
        </select>
      </label>

      {/* CATEGORY */}

      <label className="block">
        <span className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-soft)]">
          Category
        </span>

        {main ===
        "BR Collection" ? (
          <select
            value={
              name
            }
            onChange={(
              event
            ) =>
              setName(
                event.target
                  .value
              )
            }
            required
            className="mt-2 w-full px-3 py-2.5 rounded-lg border border-border bg-white text-sm outline-none focus:border-[color:var(--emerald-brand)]"
          >
            <option value="">
              — Select
              Category —
            </option>

            <option value="Stitched">
              Stitched
            </option>

            <option value="Unstitched">
              Unstitched
            </option>
          </select>
        ) : (
          <input
            value={name}
            onChange={(
              event
            ) =>
              setName(
                event.target
                  .value
              )
            }
            required
            placeholder="e.g. Shirts"
            className="mt-2 w-full px-3 py-2.5 rounded-lg border border-border bg-white text-sm outline-none focus:border-[color:var(--emerald-brand)]"
          />
        )}
      </label>

      {/* COLLECTION */}

      {main ===
        "BR Collection" && (
        <label className="block">
          <span className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-soft)]">
            Collection
          </span>

          <input
            value={
              collection
            }
            onChange={(
              event
            ) =>
              setCollection(
                event.target
                  .value
              )
            }
            required
            placeholder="e.g. 2 Piece, Kurta, Shirt"
            className="mt-2 w-full px-3 py-2.5 rounded-lg border border-border bg-white text-sm outline-none focus:border-[color:var(--emerald-brand)]"
          />
        </label>
      )}

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="btn-primary text-sm"
        >
          <FiSave />

          Save
        </button>
      </div>
    </form>
  );
}

/* =========================================================
   MODAL
========================================================= */

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;

  onClose: () => void;

  children:
    React.ReactNode;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={
        onClose
      }
    >
      <motion.div
        initial={{
          scale: 0.95,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        exit={{
          scale: 0.95,
          opacity: 0,
        }}
        className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
        onClick={(
          event
        ) =>
          event.stopPropagation()
        }
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-2xl text-[color:var(--emerald-deep)]">
            {title}
          </h3>

          <button
            type="button"
            onClick={
              onClose
            }
            className="p-1"
          >
            <FiX />
          </button>
        </div>

        {children}
      </motion.div>
    </motion.div>
  );
}