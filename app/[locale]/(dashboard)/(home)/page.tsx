import { HomePage } from "./_components/homePage";

const data = [
  {  id: "1",title: "task 0",description: "description0",is_parent: null,user_id: "1",days: [0,1,2,3,4,5,6],created_at: ""},
  {  id: "2",title: "task 1",description: "description1",is_parent: null,user_id: "1",days: [1,2,3,4,5,6,0],created_at: ""},
  {  id: "3",title: "task 2",description: "description2",is_parent: null,user_id: "1",days: [2,1,6],created_at: ""},
  {  id: "4",title: "task 3",description: "description3",is_parent: null,user_id: "1",days: [3,6],created_at: ""},
  {  id: "5",title: "task 4",description: "description4",is_parent: null,user_id: "1",days: [4,6],created_at: ""},
  {  id: "6",title: "task 5",description: "description5",is_parent: null,user_id: "1",days: [5,6],created_at: ""},
  {  id: "7",title: "task 6",description: "description6",is_parent: null,user_id: "1",days: [6,6],created_at: ""},
  {  id: "8",title: "task 6",description: "description6",is_parent: null,user_id: "1",days: [6,6],created_at: ""},
  {  id: "9",title: "task 6",description: "description6",is_parent: null,user_id: "1",days: [6,6],created_at: ""},
]
export default function Page() {
  return <HomePage data={data}/>
}
