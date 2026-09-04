import type {
  CommentData,
  LikersData,
  PostDetails,
  PostPreview,
  PostUserData,
} from "@/types/api.types";

const mockUsers: PostUserData[] = [
  {
    id: "f6e8cf88-6829-4ef2-b09b-9fe2a3059e1e",
    username: "maqas.dev",
    name: "Макс",
    avatar_url:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80",
    level: "лошок 1",
    status: "active",
  },
  {
    id: "81a36a92-68ec-45a2-b308-97cc8e963f20",
    username: "pixel.nika",
    name: "Ника",
    avatar_url:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80",
    level: "лошок 0",
    status: "active",
  },
  {
    id: "4df38ae7-a887-44e7-83c7-0ab6c3cf6e53",
    username: "urban.sanz",
    name: "Саня",
    avatar_url:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80",
    level: "лошок 1",
    status: "active",
  },
];

const mockLikerUsers: PostUserData[] = [
  ...mockUsers,
  {
    id: "463e3520-5a72-4ab7-b1ff-d38de63673b9",
    username: "frontend.vika",
    name: "Вика",
    avatar_url:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=240&q=80",
    level: "лошок 1",
    status: "active",
  },
  {
    id: "77fd3d32-31b1-406b-8c30-3bf1c2a3a2b2",
    username: "street.ilya",
    name: "Илья",
    avatar_url:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80",
    level: "лошок 0",
    status: "active",
  },
];

export const mockFollowingUserIds = mockUsers
  .slice(1)
  .map((user) => user.id);

export const mockPosts: PostDetails[] = [
  {
    id: "0611126c-4fc5-48c1-8c28-0638b265aa40",
    title: "Минималистичный сетап для ночной разработки",
    content:
      "Собрал рабочее место без лишнего визуального шума: ноут, теплый свет, механика и один широкий монитор. Самое сложное оказалось не купить новые гаджеты, а убрать то, что постоянно отвлекает. #сетап #код #ночь",
    tags: [{ tag: "технологии" }, { tag: "лайфхаки" }],
    hashtags: [{ hashtag: "сетап" }, { hashtag: "код" }, { hashtag: "ночь" }],
    image_url:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    created_at: "2026-07-24T08:25:00.000Z",
    user: mockUsers[0],
    likes_count: 128,
    comments_count: 14,
    is_liked: true,
  },
  {
    id: "8cf85f2c-94b7-4e52-a904-9415d376f2b1",
    title: "Маршрут на выходные без плотного расписания",
    content:
      "Иногда лучший план - оставить в нем пустые места. Поехали к воде, взяли кофе, прошлись по старым улицам и нашли двор, которого не было ни в одном гайде. #путешествие #город #выходные",
    tags: [{ tag: "путешествия" }, { tag: "фотография" }],
    hashtags: [
      { hashtag: "путешествие" },
      { hashtag: "город" },
      { hashtag: "выходные" },
    ],
    image_url:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    created_at: "2026-07-23T18:10:00.000Z",
    user: mockUsers[1],
    likes_count: 342,
    comments_count: 27,
    is_liked: false,
  },
  {
    id: "4c939496-a799-4317-8d42-37fd00c4f0b6",
    title: "Паста, которую реально повторить после работы",
    content:
      "Быстрый ужин на 20 минут: томаты, чеснок, базилик, немного сыра и нормальная паста. Главное - не перегреть соус и оставить чуть воды после варки. #еда #рецепт #дом",
    tags: [{ tag: "еда" }, { tag: "лайфхаки" }],
    hashtags: [{ hashtag: "еда" }, { hashtag: "рецепт" }, { hashtag: "дом" }],
    image_url:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80",
    created_at: "2026-07-22T20:42:00.000Z",
    user: mockUsers[2],
    likes_count: 89,
    comments_count: 9,
    is_liked: false,
  },
  {
    id: "761d7146-c2cb-45ee-9948-8da56a6a466b",
    title: "Плейлист для концентрации без резких переходов",
    content:
      "Собрал треки, которые не вытаскивают внимание из работы. Меньше вокала, больше ровного ритма и длинных атмосферных партий. #музыка #фокус #работа",
    tags: [{ tag: "музыка" }],
    hashtags: [
      { hashtag: "музыка" },
      { hashtag: "фокус" },
      { hashtag: "работа" },
    ],
    image_url:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80",
    created_at: "2026-07-21T13:05:00.000Z",
    user: mockUsers[0],
    likes_count: 211,
    comments_count: 18,
    is_liked: true,
  },
  {
    id: "322693ef-3fa1-42b4-9437-4d113c09ecae",
    title: "Почему темные интерфейсы не всегда удобнее",
    content:
      "Темная тема помогает ночью, но днем важнее контраст, размер текста и состояние элементов. Хороший интерфейс должен держаться не только на цвете, а на ясной иерархии. #дизайн #ui #мысли",
    tags: [{ tag: "технологии" }, { tag: "искусство" }],
    hashtags: [{ hashtag: "дизайн" }, { hashtag: "ui" }, { hashtag: "мысли" }],
    image_url: null,
    created_at: "2026-07-20T09:30:00.000Z",
    user: mockUsers[1],
    likes_count: 57,
    comments_count: 6,
    is_liked: false,
  },
  {
    id: "ba83de69-3995-4914-83c6-056592170b15",
    title: "Небольшая тренировка без зала",
    content:
      "Пятнадцать минут дома: разминка, приседания, планка, отжимания и растяжка. Не заменяет полноценный спорт, но отлично сбивает ощущение деревянной спины. #фитнес #здоровье #привычки",
    tags: [{ tag: "фитнес" }, { tag: "здоровье" }],
    hashtags: [
      { hashtag: "фитнес" },
      { hashtag: "здоровье" },
      { hashtag: "привычки" },
    ],
    image_url:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
    created_at: "2026-07-19T07:50:00.000Z",
    user: mockUsers[2],
    likes_count: 174,
    comments_count: 22,
    is_liked: false,
  },
];

export const mockPostPreviews: PostPreview[] = mockPosts.map(
  ({ content, ...post }) => ({
    ...post,
    preview: content.slice(0, 150),
  }),
);

export const mockPostLikers: LikersData[] = mockLikerUsers;

export const mockPostComments: CommentData[] = [
  {
    id: "2f2e7c61-74b7-4980-9f0d-dbc5fbb3e4a8",
    preview:
      "Очень нравится, что сетап без лишних деталей. Сразу видно, где рабочая зона, а где просто декор.",
    is_deleted: false,
    replies_count: 2,
    parent_id: null,
    created_at: "2026-07-24T09:10:00.000Z",
    is_owner: false,
    user: mockUsers[1],
  },
  {
    id: "8b7d9551-7311-4c0a-b944-4e9a4f0fd8c9",
    preview: "Да, самое сложное было убрать все лишнее со стола.",
    is_deleted: false,
    replies_count: 0,
    parent_id: "2f2e7c61-74b7-4980-9f0d-dbc5fbb3e4a8",
    created_at: "2026-07-24T09:14:00.000Z",
    is_owner: true,
    user: mockUsers[0],
  },
  {
    id: "9526c2a1-16cf-4575-bc30-285d408c4f2e",
    preview: "Монитор какой модели? По фото выглядит прям удобно для двух окон.",
    is_deleted: false,
    replies_count: 0,
    parent_id: "2f2e7c61-74b7-4980-9f0d-dbc5fbb3e4a8",
    created_at: "2026-07-24T09:22:00.000Z",
    is_owner: false,
    user: mockLikerUsers[3],
  },
  {
    id: "b80fd18b-e3c9-477a-a838-20b34f56e8f5",
    preview:
      "По цвету света плюсую. Холодная лампа вечером быстро убивает концентрацию.",
    is_deleted: false,
    replies_count: 1,
    parent_id: null,
    created_at: "2026-07-24T10:35:00.000Z",
    is_owner: false,
    user: mockUsers[2],
  },
  {
    id: "2798462a-26fb-409f-bdd2-8065545b9dd5",
    preview: "Я перешел на теплый свет и стало легче сидеть после полуночи.",
    is_deleted: false,
    replies_count: 0,
    parent_id: "b80fd18b-e3c9-477a-a838-20b34f56e8f5",
    created_at: "2026-07-24T10:49:00.000Z",
    is_owner: false,
    user: mockLikerUsers[4],
  },
  {
    id: "2edcddcf-d8c9-453d-89b7-887fae94b30c",
    preview: "Комментарий удален",
    is_deleted: true,
    replies_count: 0,
    parent_id: null,
    created_at: "2026-07-24T11:02:00.000Z",
    is_owner: false,
    user: mockLikerUsers[4],
  },
];
