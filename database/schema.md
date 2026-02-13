# Dataverse Database Schema

All tables use the prefix `timyeung_`.

---

## Table: `timyeung_n8nflow`

Main table storing shared n8n workflow definitions.

| Column (Logical Name)            | Dataverse Type       | Description                                      | Required |
|----------------------------------|----------------------|--------------------------------------------------|----------|
| `timyeung_n8nflowid`            | Uniqueidentifier (PK)| Primary key (auto-generated GUID)                | Yes      |
| `timyeung_name`                 | Single Line Text (200)| Workflow display name                            | Yes      |
| `timyeung_description`          | Multiple Lines Text   | Detailed description of the workflow             | No       |
| `timyeung_flowjson`             | Multiple Lines Text (max) | The full n8n workflow JSON                  | Yes      |
| `timyeung_author`               | Single Line Text (200)| Author / contributor name                        | Yes      |
| `timyeung_authorcontact`        | Single Line Text (300)| Author email or profile URL                      | No       |
| `timyeung_category`             | Lookup (timyeung_n8ncategory) | FK to category table                   | No       |
| `timyeung_tags`                 | Single Line Text (500)| Comma-separated tags                             | No       |
| `timyeung_version`              | Single Line Text (20) | Workflow version (e.g., "1.0.0")                 | No       |
| `timyeung_n8nversion`           | Single Line Text (20) | Minimum n8n version required                     | No       |
| `timyeung_nodecount`            | Whole Number          | Number of nodes in the workflow                  | No       |
| `timyeung_viewcount`            | Whole Number          | Number of times viewed (default 0)               | No       |
| `timyeung_downloadcount`        | Whole Number          | Number of times downloaded (default 0)           | No       |
| `timyeung_publishstatus`        | Choice                | Publish status: Draft (0), Published (1), Archived (2) | Yes |
| `timyeung_thumbnail`            | Image                 | Preview thumbnail image (stored in Dataverse)    | No       |

> **Note:** `createdon`, `modifiedon`, `statecode`, `statuscode` are system-managed columns added automatically by Dataverse.

### Choice Values for `timyeung_publishstatus`
| Value       | Label     |
|-------------|-----------|
| 101980000   | Draft     |
| 101980001   | Published |
| 101980002   | Archived  |

> **Note:** Dataverse Choice values use publisher-prefixed numbers (10198xxxx). Check your actual values in the table customization UI.

---

## Table: `timyeung_n8ncategory`

Lookup table for workflow categories.

| Column (Logical Name)            | Dataverse Type       | Description                                      | Required |
|----------------------------------|----------------------|--------------------------------------------------|----------|
| `timyeung_n8ncategoryid`        | Uniqueidentifier (PK)| Primary key (auto-generated GUID)                | Yes      |
| `timyeung_name`                 | Single Line Text (100)| Category name (e.g., "Automation", "AI & ML")    | Yes      |
| `timyeung_description`          | Single Line Text (500)| Category description                             | No       |
| `timyeung_displayorder`         | Whole Number          | Sort order for UI display                        | No       |
| `timyeung_icon`                 | Single Line Text (50) | Icon identifier (e.g., "bot", "zap")             | No       |

> **Note:** `createdon`, `modifiedon` are system-managed columns added automatically by Dataverse.

### Seed Data
| Name              | Display Order | Icon          |
|-------------------|---------------|---------------|
| Automation        | 1             | zap           |
| AI & ML           | 2             | bot           |
| Data Integration  | 3             | database      |
| DevOps            | 4             | git-branch    |
| Marketing         | 5             | megaphone     |
| Sales             | 6             | trending-up   |
| HR                | 7             | users         |
| Finance           | 8             | dollar-sign   |
| IT Operations     | 9             | server        |
| Customer Support  | 10            | headphones    |

---

## Table: `timyeung_n8nflowstat`

Optional analytics table for tracking per-day view/download stats.

| Column (Logical Name)            | Dataverse Type       | Description                                      | Required |
|----------------------------------|----------------------|--------------------------------------------------|----------|
| `timyeung_n8nflowstatid`       | Uniqueidentifier (PK)| Primary key (auto-generated GUID)                | Yes      |
| `timyeung_flowid`              | Lookup (timyeung_n8nflow) | FK to the flow record                       | Yes      |
| `timyeung_date`                | Date Only             | The date of the stat entry                       | Yes      |
| `timyeung_views`               | Whole Number          | Views on this date                               | No       |
| `timyeung_downloads`           | Whole Number          | Downloads on this date                           | No       |

---

## Relationships

- `timyeung_n8nflow.timyeung_category` → Many-to-One → `timyeung_n8ncategory.timyeung_n8ncategoryid`
- `timyeung_n8nflowstat.timyeung_flowid` → Many-to-One → `timyeung_n8nflow.timyeung_n8nflowid`

---

## Notes

- `timyeung_flowjson` stores the complete n8n workflow JSON (nodes, connections, settings).
- Tags are stored as comma-separated values for simplicity; split on read.
- `timyeung_publishstatus` value `101980001` = Published, used for the API listing query.
- The n8n backend workflow filters by `timyeung_publishstatus eq 101980001` when listing flows.
- `statecode` / `statuscode` are Dataverse system fields — use `timyeung_publishstatus` for the custom publish lifecycle.
