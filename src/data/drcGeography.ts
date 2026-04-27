export interface Territoire {
  name: string;
  zones_de_sante: string[];
}

export interface Province {
  name: string;
  territoires: Territoire[];
}

export const drcGeography: { provinces: Province[] } = {
  provinces: [
    {
      name: "Ituri",
      territoires: [
        { name: "Bunia", zones_de_sante: ["Bunia", "Rwampara", "Nyakunde", "Marabo", "Nizi"] },
        { name: "Aru", zones_de_sante: ["Aru", "Faradje", "Logo", "Ngilima", "Mahagi"] },
        { name: "Djugu", zones_de_sante: ["Bambu", "Linga", "Rethy", "Fataki"] },
        { name: "Irumu", zones_de_sante: ["Irumu", "Komanda", "Luna", "Mambasa"] },
        { name: "Mambasa", zones_de_sante: ["Mambasa", "Mandima", "Wamba"] },
        { name: "Mahagi", zones_de_sante: ["Angumu", "Kpandroma", "Mahagi", "Ora"] },
      ],
    },
    {
      name: "Nord Kivu",
      territoires: [
        { name: "Goma", zones_de_sante: ["Goma", "Karisimbi", "Nyiragongo", "Kibumba"] },
        { name: "Beni", zones_de_sante: ["Beni", "Oicha", "Ruwenzori", "Mulekera", "Mabalako", "Musienene"] },
        { name: "Butembo", zones_de_sante: ["Butembo", "Butsili", "Katwa", "Kyondo", "Masereka", "Musienene", "Vuhovi"] },
        { name: "Lubero", zones_de_sante: ["Lubero", "Alimbongo", "Birambizo", "Biena", "Kanyabayonga", "Kayna", "Manguredjipa", "Nyankunde", "Pinga"] },
        { name: "Masisi", zones_de_sante: ["Masisi", "Kitchanga", "Mweso", "Nyabiondo", "Walikale"] },
        { name: "Rutshuru", zones_de_sante: ["Rutshuru", "Bambo", "Binza", "Kiwanja", "Rwindi"] },
        { name: "Walikale", zones_de_sante: ["Walikale", "Itebero", "Kibua", "Ngungu", "Hombo"] },
      ],
    },
    {
      name: "Sud Kivu",
      territoires: [
        { name: "Bukavu", zones_de_sante: ["Bagira", "Ibanda", "Kadutu", "Kasha"] },
        { name: "Fizi", zones_de_sante: ["Fizi", "Baraka", "Kimbi", "Lulenge", "Nundu"] },
        { name: "Kalehe", zones_de_sante: ["Kalehe", "Bunyakiri", "Kalonge", "Minova", "Shabunda"] },
        { name: "Kabare", zones_de_sante: ["Kabare", "Bagira", "Miti-Murhesa", "Katana"] },
        { name: "Mwenga", zones_de_sante: ["Mwenga", "Kamituga", "Kigulube", "Shabunda"] },
        { name: "Shabunda", zones_de_sante: ["Shabunda", "Lulingu", "Nzovu"] },
        { name: "Uvira", zones_de_sante: ["Uvira", "Budjala", "Lemera", "Nundu", "Sange"] },
        { name: "Walungu", zones_de_sante: ["Walungu", "Izege", "Kaniola", "Luhwindja", "Nzibira"] },
      ],
    },
    {
      name: "Kinshasa",
      territoires: [
        {
          name: "Kinshasa Ville",
          zones_de_sante: [
            "Barumbu", "Binza Meteo", "Binza Ozone", "Bumbu", "Gombe", "Kalamu",
            "Kasa-Vubu", "Kimbanseke", "Kisenso", "Lemba", "Limete", "Lingwala",
            "Makala", "Maluku", "Masina", "Matete", "Mont Ngafula", "Ndjili",
            "Ngaba", "Ngaliema", "Ngiri-Ngiri", "Nsele", "Selembao",
          ],
        },
      ],
    },
    {
      name: "Tanganyika",
      territoires: [
        { name: "Kalemie", zones_de_sante: ["Kalemie", "Nyemba", "Mulenge"] },
        { name: "Manono", zones_de_sante: ["Manono", "Kabalo", "Malemba"] },
        { name: "Moba", zones_de_sante: ["Moba", "Kirungu", "Pweto"] },
        { name: "Nyunzu", zones_de_sante: ["Nyunzu", "Kongolo"] },
      ],
    },
    {
      name: "Maniema",
      territoires: [
        { name: "Kindu", zones_de_sante: ["Kindu", "Alunguli", "Wamaza"] },
        { name: "Kabambare", zones_de_sante: ["Kabambare", "Lubutu"] },
        { name: "Kasongo", zones_de_sante: ["Kasongo", "Kibombo"] },
        { name: "Pangi", zones_de_sante: ["Pangi", "Punia", "Lubutu"] },
      ],
    },
    {
      name: "Haut Katanga",
      territoires: [
        { name: "Lubumbashi", zones_de_sante: ["Lubumbashi", "Katuba", "Kenya", "Kampemba", "Ruashi", "Tshamilemba"] },
        { name: "Kipushi", zones_de_sante: ["Kipushi", "Kasenga"] },
        { name: "Likasi", zones_de_sante: ["Likasi", "Panda", "Shituru"] },
        { name: "Kolwezi", zones_de_sante: ["Kolwezi", "Dilala", "Mutshatsha"] },
      ],
    },
    {
      name: "Kasaï Central",
      territoires: [
        { name: "Kananga", zones_de_sante: ["Kananga", "Lukonga", "Ndesha"] },
        { name: "Dibaya", zones_de_sante: ["Dibaya", "Luiza"] },
        { name: "Dimbelenge", zones_de_sante: ["Dimbelenge", "Kazumba"] },
      ],
    },
    {
      name: "Kasaï",
      territoires: [
        { name: "Tshikapa", zones_de_sante: ["Tshikapa", "Kamonia", "Katende"] },
        { name: "Mweka", zones_de_sante: ["Mweka", "Ilebo"] },
      ],
    },
    {
      name: "Équateur",
      territoires: [
        { name: "Mbandaka", zones_de_sante: ["Mbandaka", "Bikoro", "Wangata", "Irebu"] },
        { name: "Basankusu", zones_de_sante: ["Basankusu", "Bolomba", "Ingende"] },
        { name: "Bomongo", zones_de_sante: ["Bomongo", "Makanza"] },
      ],
    },
    {
      name: "Nord Ubangi",
      territoires: [
        { name: "Gbadolite", zones_de_sante: ["Gbadolite", "Bili", "Yakoma", "Mobayi"] },
        { name: "Businga", zones_de_sante: ["Businga", "Karawa", "Kungu"] },
      ],
    },
    {
      name: "Sud Ubangi",
      territoires: [
        { name: "Gemena", zones_de_sante: ["Gemena", "Libenge", "Zongo", "Budjala"] },
        { name: "Kungu", zones_de_sante: ["Kungu", "Abumombazi"] },
      ],
    },
    {
      name: "Tshopo",
      territoires: [
        { name: "Kisangani", zones_de_sante: ["Kisangani", "Makiso", "Tshopo", "Lubunga", "Kabondo"] },
        { name: "Ubundu", zones_de_sante: ["Ubundu", "Opala"] },
      ],
    },
    {
      name: "Haut Uélé",
      territoires: [
        { name: "Isiro", zones_de_sante: ["Isiro", "Rungu", "Wamba", "Dungu"] },
        { name: "Dungu", zones_de_sante: ["Dungu", "Faradje", "Nagero"] },
      ],
    },
    {
      name: "Bas Uélé",
      territoires: [
        { name: "Buta", zones_de_sante: ["Buta", "Aketi", "Bambesa", "Likati"] },
        { name: "Ango", zones_de_sante: ["Ango", "Bondo"] },
      ],
    },
    {
      name: "Sankuru",
      territoires: [
        { name: "Lodja", zones_de_sante: ["Lodja", "Kole", "Lomela"] },
        { name: "Lusambo", zones_de_sante: ["Lusambo", "Katako-Kombe"] },
      ],
    },
    {
      name: "Kwilu",
      territoires: [
        { name: "Kikwit", zones_de_sante: ["Kikwit", "Bulungu", "Gungu", "Idiofa"] },
        { name: "Bandundu", zones_de_sante: ["Bandundu", "Bagata", "Mushie"] },
      ],
    },
    {
      name: "Kwango",
      territoires: [
        { name: "Kenge", zones_de_sante: ["Kenge", "Feshi", "Kasongo-Lunda", "Popokabaka"] },
      ],
    },
    {
      name: "Mai-Ndombe",
      territoires: [
        { name: "Inongo", zones_de_sante: ["Inongo", "Kiri", "Kutu", "Oshwe"] },
        { name: "Bolobo", zones_de_sante: ["Bolobo", "Yumbi"] },
      ],
    },
    {
      name: "Lualaba",
      territoires: [
        { name: "Kolwezi", zones_de_sante: ["Kolwezi", "Dilala", "Mutshatsha", "Sandoa"] },
        { name: "Kapanga", zones_de_sante: ["Kapanga", "Kasaji"] },
      ],
    },
    {
      name: "Haut Lomami",
      territoires: [
        { name: "Kamina", zones_de_sante: ["Kamina", "Bukama", "Kabongo", "Kaniama"] },
        { name: "Malemba-Nkulu", zones_de_sante: ["Malemba-Nkulu", "Kabalo"] },
      ],
    },
    {
      name: "Lomami",
      territoires: [
        { name: "Kabinda", zones_de_sante: ["Kabinda", "Lubao", "Ngandajika", "Sankuru"] },
        { name: "Mwene-Ditu", zones_de_sante: ["Mwene-Ditu", "Miabi"] },
      ],
    },
    {
      name: "Kasaï Oriental",
      territoires: [
        { name: "Mbuji-Mayi", zones_de_sante: ["Bipemba", "Dibindi", "Katanda", "Muya", "Nzaba"] },
        { name: "Kabinda", zones_de_sante: ["Kabinda", "Luilu"] },
      ],
    },
    {
      name: "Mongala",
      territoires: [
        { name: "Lisala", zones_de_sante: ["Lisala", "Bumba", "Bongandanga", "Loko"] },
      ],
    },
    {
      name: "Tshuapa",
      territoires: [
        { name: "Boende", zones_de_sante: ["Boende", "Befale", "Djolu", "Monkoto", "Yahuma"] },
      ],
    },
    {
      name: "Kongo Central",
      territoires: [
        { name: "Matadi", zones_de_sante: ["Matadi", "Boma", "Lukula", "Muanda", "Tshela"] },
        { name: "Mbanza-Ngungu", zones_de_sante: ["Mbanza-Ngungu", "Kisantu", "Madimba", "Songololo"] },
      ],
    },
  ],
};
