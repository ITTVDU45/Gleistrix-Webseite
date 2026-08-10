import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { deleteBlogCategoryAction } from "@/app/admin/blog-actions";
import { CategoryForm } from "@/components/admin/blog/forms";
import Modal from "@/components/admin/pricing/Modal";
import { NeutralBadge } from "@/components/admin/pricing/ui";
import { EmptyState, Mono, Section, formatNumber } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { articleCountByCategory, listBlogCategories, listBlogSources } from "@/lib/admin/blog/store";

/**
 * Rubrikverwaltung.
 *
 * Liegt unter /admin/blog/kategorien und nicht auf gleicher Ebene, weil sie
 * ohne den Blog keinen Zweck hat. Der statische Pfad geht der Artikelseite
 * /admin/blog/[id] vor – Artikelkennungen tragen immer einen Zeitstempel,
 * "kategorien" kann daher nie als Kennung entstehen.
 */
export const metadata = { title: "Kategorien" };

export default async function BlogCategoriesPage() {
  const [categories, counts, sources] = await Promise.all([
    listBlogCategories(),
    articleCountByCategory(),
    listBlogSources(),
  ]);

  const sourceCounts = new Map<string, number>();
  for (const source of sources) {
    if (!source.category) continue;
    sourceCounts.set(source.category, (sourceCounts.get(source.category) ?? 0) + 1);
  }

  return (
    <div className="space-y-8">
      <header>
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Zurück zu Blog &amp; News
        </Link>

        <h1 className="mt-3 text-2xl font-semibold tracking-tight">Kategorien</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Rubriken für Quellen und Artikel. Die Beschreibung ist kein Beiwerk: die
          Quellenauswertung entscheidet daran, wohin ein neues Dokument gehört – je konkreter
          sie ist, desto treffsicherer die Einordnung.
        </p>
      </header>

      <Section
        title={`Rubriken (${formatNumber(categories.length)})`}
        description="Umbenennen zieht auf alle Artikel und Quellen durch. Löschen lässt bestehende Artikel unangetastet."
        action={
          <Modal
            label="Kategorie anlegen"
            title="Neue Kategorie"
            description="Name und eine Beschreibung, an der die Auswertung erkennt, was hierher gehört."
          >
            <CategoryForm />
          </Modal>
        }
      >
        {categories.length === 0 ? (
          <EmptyState>Noch keine Rubrik angelegt.</EmptyState>
        ) : (
          <ul className="space-y-3">
            {categories.map((category) => {
              const articles = counts.get(category.name) ?? 0;
              const sourceCount = sourceCounts.get(category.name) ?? 0;

              return (
                <li key={category.id} className="rounded-xl border p-3.5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{category.name}</p>
                      <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                        {category.description || (
                          <span className="italic">
                            Ohne Beschreibung – die Auswertung trifft diese Rubrik schlechter.
                          </span>
                        )}
                      </p>
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        <Mono>/blog/kategorie/{category.slug}</Mono>
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                      <NeutralBadge>{formatNumber(articles)} Artikel</NeutralBadge>
                      <NeutralBadge>
                        {formatNumber(sourceCount)} {sourceCount === 1 ? "Quelle" : "Quellen"}
                      </NeutralBadge>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-end gap-1">
                    <Modal
                      label="Bearbeiten"
                      variant="outline"
                      title={category.name}
                      description="Ein geänderter Name zieht auf alle zugeordneten Artikel und Quellen durch."
                    >
                      <CategoryForm category={category} />
                    </Modal>

                    <form action={deleteBlogCategoryAction}>
                      <input type="hidden" name="categoryId" value={category.id} />
                      <Button type="submit" size="sm" variant="ghost">
                        {articles > 0
                          ? `Löschen (${formatNumber(articles)} Artikel behalten die Rubrik)`
                          : "Löschen"}
                      </Button>
                    </form>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Section>
    </div>
  );
}
